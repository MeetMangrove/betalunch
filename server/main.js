import { Meteor } from 'meteor/meteor';
import moment from 'moment-timezone';
import { Email } from 'meteor/email';
import { mjml2html } from 'mjml';
import { Random } from 'meteor/random';
import pull from 'lodash/pull';
import cron from 'cron';
import { Registered, Files } from '../both/collections';

const week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const url = Meteor.settings.url;
const timeZone = Meteor.settings.timeZone;

Meteor.startup(() => {
    process.env.MAIL_URL = 'smtp://thomaster:mangrove2016@smtp.sendgrid.net:587'; // TODO: move value to scalingo's environment variables => remove this line
    const job = new cron.CronJob({
        cronTime: '00 00 0,9,12 * * *', // TODO: doing one cronjob per hour (one for midnight, one for 9am and one for 12pm) would remove the necessity of the several `if(timeHours...)` in the function below => better readability
        // TODO: the definition of the function below should be done outside of the Meteor.startup() block, to increase readability
        onTick: Meteor.bindEnvironment(function() {
            const timeHours = moment().tz(timeZone).hours();
            console.log('CRONJOB hour:', timeHours);
            if (timeHours === 0 && moment().day() === 1) {
                Registered.update({}, {$set: {isPairedWeek: true}});
            }
            if (timeHours === 0) {
                Registered.update({}, {$set: {isPairedToday: false}});
            }
            if (timeHours === 9) {
                Registered.find({}).fetch().forEach((register) => { // TODO: this fat arrow fct could be moved outside of the block, for readability
                    const htmlOutput = mjml2html(`
                        <mjml>
                            <mj-body>
                                <mj-container>
                                    <mj-section>
                                        <mj-column>
                                          <mj-image width="150" border-radius="50%"src="${url}${Files.findOne({_id: register.picture}).url()}" />           
                                            <mj-text align="center" font-size="24px">
                                                Good morning ${register.name} !<br/>  
                                                Do you want to be paired today ?
                                            </mj-text>
                                        </mj-column>
                                    </mj-section>
                                    <mj-section>
                                        <mj-group>
                                            <mj-column>
                                                <mj-button 
                                                   font-family="Helvetica" 
                                                   background-color="#8BC34A" 
                                                   color="white"
                                                   inner-padding="20px"
                                                   href="${url}/accept/${register._id}">
                                                      Yes
                                                </mj-button>
                                            </mj-column>
                                            <mj-column>
                                                <mj-button 
                                                   font-family="Helvetica" 
                                                   background-color="#FF5722" 
                                                   color="white"
                                                   inner-padding="20px"                                                 
                                                   href="${url}/reject/${register._id}">
                                                      No
                                                </mj-button>
                                            </mj-column>
                                        </mj-group>
                                      </mj-section>
                                     <mj-divider border-width="1px" border-style="dashed" border-color="lightgrey" />
                                      <mj-section>
                                        <mj-group>
                                               <mj-button 
                                                   font-family="Helvetica" 
                                                   background-color="#039be5" 
                                                   inner-padding="15px"
                                                   padding-bottom="15px"
                                                   color="white"
                                                   href="${url}/reject_week/${register._id}">
                                                      I don't want a pairing this week.
                                                    </mj-button>
                                             <mj-spacer height="15px" />
                                                 <mj-button 
                                                   font-family="Helvetica" 
                                                   background-color="#039be5" 
                                                   inner-padding="15px"
                                                   href="${url}/change_pairing_days/${register._id}">
                                                      I want to change my pairing days.
                                                 </mj-button>
                                             <mj-spacer height="15px" />
                                                 <mj-button 
                                                   font-family="Helvetica" 
                                                   background-color="#039be5" 
                                                   inner-padding="15px"
                                                   color="white"
                                                   href="${url}/unsubscribe/${register._id}">
                                                      I want to be unsubscribed.
                                                 </mj-button>                                     
                                        </mj-group>
                                    </mj-section>
                                </mj-container>
                            </mj-body>
                        </mjml>
                    `);
                    Email.send({
                        to: register.email,
                        from: process.env.FROM_EMAIL,
                        subject: 'Do you want a pairing today ?',
                        html: htmlOutput
                    });
                });
            }
            if (timeHours === 12) {
                let listToPaired = Registered.find({
                    isPairedToday: true,
                    isPairedWeek: true
                    /*week: {
                     $elemMatch: {
                     $eq: week[moment().day() - 1] // TODO: explain this
                     }
                     }*/
                }).fetch();
                let oddPeople = null; // TODO: what is this? one person? a list of people? why? we need explainations here.
                if (listToPaired % 2 === 1) { // TODO: listToPaired.length, you mean?
                    oddPeople = Random.choice(listToPaired);
                    pull(listToPaired, oddPeople);
                }
                const length = listToPaired.length;
                for (let i = 0; i < length / 2; i++) {
                    const peopleOne = Random.choice(listToPaired);
                    pull(listToPaired, peopleOne);
                    const peopleTwo = Random.choice(listToPaired);
                    pull(listToPaired, peopleTwo);
                    if (i + 1 === length && oddPeople) { // TODO: explain why this condition
                        // TODO: this rendering fct could be moved outside of the block, for readability
                        const htmlOutput = mjml2html(`
                        <mjml>
                            <mj-body>
                                <mj-container>
                                    <mj-section>
                                        <mj-column>
                                            <mj-text font-size="24px" align="center">
                                                Congratulations, you are paired !
                                            </mj-text>
                                        </mj-column>
                                      </mj-section>
                                      <mj-section>
                                        <mj-column>
                                         <mj-image width="150" border-radius="50%"src="${url}${Files.findOne({_id: peopleOne.picture}).url()}" />
                                         <mj-text font-size="20px" align="center">
                                                ${peopleOne.name}
                                            </mj-text>
                                         <mj-text font-size="18px" align="center" font-style="italic"
                                         color="#9E9E9E">
                                                ${peopleOne.number}
                                            </mj-text>
                                        </mj-column>
                                        <mj-column>
                                         <mj-image width="150" border-radius="50%" src="${url}${Files.findOne({_id: peopleTwo.picture}).url()}" />
                                         <mj-text font-size="20px" align="center">
                                                ${peopleTwo.name}
                                            </mj-text>
                                         <mj-text font-size="18px" align="center" font-style="italic"
                                         color="#9E9E9E">
                                                ${peopleTwo.number}
                                            </mj-text>
                                        </mj-column>
                                        <mj-column>
                                         <mj-image width="150" border-radius="50%" src="${url}${Files.findOne({_id: oddPeople.picture}).url()}" />
                                         <mj-text font-size="20px" align="center">
                                                ${oddPeople.name}
                                            </mj-text>
                                         <mj-text font-size="18px" align="center" font-style="italic"
                                         color="#9E9E9E">
                                                ${oddPeople.number}
                                            </mj-text>
                                        </mj-column>
                                    </mj-section>
                                </mj-container>
                            </mj-body>
                        </mjml>
                        `);
                        Email.send({
                            to: [peopleOne.email, peopleTwo.email, oddPeople.email],
                            from: 'thomas.jeanneau.freelance@gmail.com',
                            subject: 'You are paired !',
                            html: htmlOutput
                        });
                    } else {
                        // TODO: this rendering fct could be moved outside of the block, for readability
                        const htmlOutput = mjml2html(`
                        <mjml>
                            <mj-body>
                                <mj-container>
                                    <mj-section>
                                        <mj-column>
                                            <mj-text font-size="24px" align="center">
                                                Congratulations, you are paired !
                                            </mj-text>
                                        </mj-column>
                                      </mj-section>
                                      <mj-section>
                                        <mj-column>
                                         <mj-image width="150" border-radius="50%"src="${url}${Files.findOne({_id: peopleOne.picture}).url()}" />
                                         <mj-text font-size="20px" align="center">
                                                ${peopleOne.name}
                                            </mj-text>
                                         <mj-text font-size="18px" align="center" font-style="italic"
                                         color="#9E9E9E">
                                                ${peopleOne.number}
                                            </mj-text>
                                        </mj-column>
                                        <mj-column>
                                         <mj-image width="150" border-radius="50%" src="${url}${Files.findOne({_id: peopleTwo.picture}).url()}" />
                                         <mj-text font-size="20px" align="center">
                                                ${peopleTwo.name}
                                            </mj-text>
                                         <mj-text font-size="18px" align="center" font-style="italic"
                                         color="#9E9E9E">
                                                ${peopleTwo.number}
                                            </mj-text>
                                        </mj-column>
                                    </mj-section>
                                </mj-container>
                            </mj-body>
                        </mjml>
                        `);
                        Email.send({
                            to: [peopleOne.email, peopleTwo.email],
                            from: 'thomas.jeanneau.freelance@gmail.com',
                            subject: 'You are paired !',
                            html: htmlOutput
                        });
                    }
                }
            }
        }),
        start: false,
        timeZone: timeZone
    });
    job.start();
});

