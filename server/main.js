import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import moment from 'moment-timezone';
import { Email } from 'meteor/email';
import { mjml2html } from 'mjml'

import { Registered } from '../both/collections';

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
            if(moment().hours() === 16){
                Registered.find({}).fetch().forEach((register) => {
                    const htmlOutput = mjml2html(`
                        <mjml>
                            <mj-body>
                                <mj-container>
                                  <mj-section>
                                    <mj-column>
                                      <mj-text>
                                        Welcome to Betahaus ${register.name} !
                                        
                                        Do you want a pairing today ?
                                      </mj-text>
                                    </mj-column>
                                  </mj-section>
                                  <mj-section>
                                    <mj-column>
                                       <mj-button 
                                       font-family="Helvetica" 
                                       background-color="#8BC34A" 
                                       color="white"
                                       href="https://betahaus-pairing.scalingo.io/accept/${register._id}">
                                          Yes
                                        </mj-button>
                                    </mj-column>
                                     <mj-column>
                                       <mj-button 
                                       font-family="Helvetica" 
                                       background-color="#FFEB3B" 
                                       color="white"
                                       href="https://betahaus-pairing.scalingo.io/reject/${register._id}">
                                          No
                                        </mj-button>
                                    </mj-column>
                                    </mj-section>
                                    <mj-section>
                                     <mj-column>
                                       <mj-button 
                                       font-family="Helvetica" 
                                       background-color="#FF9800" 
                                       color="white"
                                       href="https://betahaus-pairing.scalingo.io/rejectweek/${register._id}">
                                          I don't want a pairing this week.
                                        </mj-button>
                                    </mj-column>
                                     <mj-column>
                                       <mj-button 
                                       font-family="Helvetica" 
                                       background-color="#FF5722" 
                                       color="white"
                                       href="https://betahaus-pairing.scalingo.io/unsubscribe/${register._id}">
                                          I want to be unsubscribed.
                                        </mj-button>
                                    </mj-column>
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
            if(moment().hours() === 12){

            }
        }, 36)
    });
});

