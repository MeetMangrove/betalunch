import { Meteor } from 'meteor/meteor';
import moment from 'moment-timezone';
import { Email } from 'meteor/email';
import { Random } from 'meteor/random';
import pull from 'lodash/pull';
import cron from 'cron';
import { Registered } from '../both/collections';
import { askForMatchingHTML, matchingMailHTML1, matchingMailHTML2 } from './mail';

const week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const timeZone = Meteor.settings.timeZone;
const email = Meteor.settings.email;

let initialisation = Meteor.bindEnvironment(() => {
    Registered.update({}, {$set: {isPairedToday: false}}, {multi: true});
    if (moment().tz(timeZone).day() === 1) {
        Registered.update({}, {$set: {isPairedWeek: true}}, {multi: true});
    }
    console.log('Initialisation CRONJOB run');
});

let askForMatching = Meteor.bindEnvironment(() => {
    const today = week[moment().day() - 1];
    Registered.find({
        isPairedWeek: true,
        week: {
            $elemMatch: {
                $eq: today
            }
        }}).fetch().forEach((register) => {
        Email.send({
            to: register.email,
            from: email,
            subject: 'Down for a betalunch today?',
            html: askForMatchingHTML(register)
        });
    });
    console.log('askForMatching CRONJOB run');
});

let matchingMail = Meteor.bindEnvironment(() => {
    const today = week[moment().day() - 1];
    let listToPaired = Registered.find({
        isPairedToday: true,
        isPairedWeek: true,
        week: {
            $elemMatch: {
                $eq: today
            }
        }
    }).fetch();
    const length = listToPaired.length;
    let oddPeople = null; // The one who gonna be paired with two person if needed
    if (length % 2 === 1) {
        oddPeople = Random.choice(listToPaired);
        pull(listToPaired, oddPeople);
    }
    for (let i = 0; i < length / 2; i++) {
        let peopleOne, peopleTwo;
        do {
            peopleOne = Random.choice(listToPaired);
            peopleTwo = Random.choice(listToPaired);
        } while (peopleOne.lastPairing === peopleTwo._id
            || peopleTwo.lastPairing === peopleOne._id
            || peopleOne._id === peopleTwo._id);
        pull(listToPaired, peopleOne);
        pull(listToPaired, peopleTwo);
        Registered.update({_id: peopleOne._id}, {$set: {lastPairing: peopleTwo._id}});
        Registered.update({_id: peopleTwo._id}, {$set: {lastPairing: peopleOne._id}});
        if (i + 1 === length && oddPeople) {
            Email.send({
                to: [peopleOne.email, peopleTwo.email, oddPeople.email],
                from: email,
                subject: 'Meet your betalunch buddy! ',
                html: matchingMailHTML2(peopleOne, peopleTwo, oddPeople)
            });
        } else {
            Email.send({
                to: [peopleOne.email, peopleTwo.email],
                from: email,
                subject: 'Meet your betalunch buddy! ',
                html: matchingMailHTML1(peopleOne, peopleTwo)
            });
        }
    }
    console.log('matchingMail CRONJOB run');
});

const jobInitialisation = new cron.CronJob({
    cronTime: '00 00 0 * * 1-5',
    onTick: initialisation,
    start: false,
    timeZone: timeZone
});

const jobAskForMatching = new cron.CronJob({
    cronTime: '00 00 9 * * 1-5',
    onTick: askForMatching,
    start: false,
    timeZone: timeZone
});

const jobMatchingMail = new cron.CronJob({
    cronTime: '00 00 12 * * 1-5',
    onTick: matchingMail,
    start: false,
    timeZone: timeZone
});

Meteor.startup(() => {
    jobInitialisation.start();
    jobAskForMatching.start();
    jobMatchingMail.start();
});


