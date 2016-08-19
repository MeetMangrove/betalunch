import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import moment from 'moment-timezone';
import { Email } from 'meteor/email';
import { mjml2html } from 'mjml';
import { Random } from 'meteor/random';
import pull from 'lodash/pull';
import { Registered, Files } from '../both/collections';

const week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

Meteor.startup(() => {
    process.env.MAIL_URL = 'smtp://thomaster:mangrove2016@smtp.sendgrid.net:587';

    Tracker.autorun(() => {
        Meteor.setTimeout(() => {
            if(moment().hours() === 0 && moment().day() === 1){
                Registered.update({}, {$set: {isPairedWeek: true}});
            }
            if(moment().hours() === 0){
                Registered.update({}, {$set: {isPairedToday: false}});
            }
            if(moment().hours() === 9 && moment().day() < 6){
                Registered.find({}).fetch().forEach((register) => {
                    const htmlOutput = mjml2html(`
                        <mjml>
                            <mj-body>
                                <mj-container>
                                    <mj-section>
                                        <mj-column>
                                            <mj-text>
                                                Welcome to Betahaus ${register.name} !<br/>                                  
                                                Do you want a pairing today ?
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
                                                   href="http://localhost:3000/accept/${register._id}">
                                                      Yes
                                                </mj-button>
                                            </mj-column>
                                            <mj-column>
                                                <mj-button 
                                                   font-family="Helvetica" 
                                                   background-color="#FFC107" 
                                                   color="white"
                                                   href="http://localhost:3000/reject/${register._id}">
                                                      No
                                                </mj-button>
                                            </mj-column>
                                        </mj-group>
                                        <mj-group>
                                            <mj-column>
                                                <mj-button 
                                                   font-family="Helvetica" 
                                                   background-color="#FF9800" 
                                                   color="white"
                                                   href="http://localhost:3000/rejectweek/${register._id}">
                                                      I don't want a pairing this week.
                                                    </mj-button>
                                            </mj-column>
                                            <mj-column>
                                                 <mj-button 
                                                   font-family="Helvetica" 
                                                   background-color="#FF5722" 
                                                   color="white"
                                                   href="http://localhost:3000/unsubscribe/${register._id}">
                                                      I want to be unsubscribed.
                                                 </mj-button>
                                            </mj-column>
                                        </mj-group>
                                    </mj-section>
                                </mj-container>
                            </mj-body>
                        </mjml>
                    `);
                    Email.send({
                        to: register.email,
                        from: 'thomas.jeanneau.freelance@gmail.com',
                        subject: 'Do you want a pairing today ?',
                        html: htmlOutput
                    });
                });
            }
            if(moment().hours() === 12 && moment().day() < 6){
                let listToPaired = Registered.find({
                    isPairedToday: true,
                    isPairedWeek: true,
                    week: {
                        $elemMatch: {
                            $eq: week[moment().day() - 1]
                        }
                    }
                }).fetch();
                let oddPeople = null;
                if(listToPaired % 2 === 1){
                    oddPeople = Random.choice(listToPaired);
                    pull(listToPaired, oddPeople);
                }
                const length = listToPaired.length;
                for(let i = 0; i < length / 2 ; i++) {
                    const peopleOne = Random.choice(listToPaired);
                    pull(listToPaired, peopleOne);
                    const peopleTwo = Random.choice(listToPaired);
                    pull(listToPaired, peopleTwo);

                    if(i + 1 === length && oddPeople){
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
                                         <mj-image width="150" border-radius="50%"src="https://betahaus-pairing.scalingo.io/${Files.findOne({_id: peopleOne.picture}).url()}" />
                                         <mj-text font-size="20px" align="center">
                                                ${peopleOne.name}
                                            </mj-text>
                                         <mj-text font-size="18px" align="center" font-style="italic"
                                         color="#9E9E9E">
                                                ${peopleOne.number}
                                            </mj-text>
                                        </mj-column>
                                        <mj-column>
                                         <mj-image width="150" border-radius="50%" src="https://betahaus-pairing.scalingo.io/${Files.findOne({_id: peopleTwo.picture}).url()}" />
                                         <mj-text font-size="20px" align="center">
                                                ${peopleTwo.name}
                                            </mj-text>
                                         <mj-text font-size="18px" align="center" font-style="italic"
                                         color="#9E9E9E">
                                                ${peopleTwo.number}
                                            </mj-text>
                                        </mj-column>
                                        <mj-column>
                                         <mj-image width="150" border-radius="50%" src="https://betahaus-pairing.scalingo.io/${Files.findOne({_id: oddPeople.picture}).url()}" />
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
                    }else{
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
                                         <mj-image width="150" border-radius="50%"src="https://betahaus-pairing.scalingo.io/${Files.findOne({_id: peopleOne.picture}).url()}" />
                                         <mj-text font-size="20px" align="center">
                                                ${peopleOne.name}
                                            </mj-text>
                                         <mj-text font-size="18px" align="center" font-style="italic"
                                         color="#9E9E9E">
                                                ${peopleOne.number}
                                            </mj-text>
                                        </mj-column>
                                        <mj-column>
                                         <mj-image width="150" border-radius="50%" src="https://betahaus-pairing.scalingo.io/${Files.findOne({_id: peopleTwo.picture}).url()}" />
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
        }, 36);
    });
});

