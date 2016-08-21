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
    Registered.update({}, {$set: {isPairedToday: false}});
    if (moment().tz(timeZone).day() === 1) {
        Registered.update({}, {$set: {isPairedWeek: true}});
    }
    console.log('Initialisation CRONJOB run');
});

let askForMatching = Meteor.bindEnvironment(() => {
    Registered.find({}).fetch().forEach((register) => {
        Email.send({
            to: register.email,
            from: email,
            subject: 'Do you want a pairing today ?',
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
        const peopleOne = Random.choice(listToPaired);
        pull(listToPaired, peopleOne);
        const peopleTwo = Random.choice(listToPaired);
        pull(listToPaired, peopleTwo);
        if (i + 1 === length && oddPeople) {
            Email.send({
                to: [peopleOne.email, peopleTwo.email, oddPeople.email],
                from: email,
                subject: 'You are paired !',
                html: matchingMailHTML2(peopleOne, peopleTwo, oddPeople)
            });
        } else {
            Email.send({
                to: [peopleOne.email, peopleTwo.email],
                from: email,
                subject: 'You are paired !',
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


