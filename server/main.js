import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import moment from 'moment-timezone';
import { Email } from 'meteor/email';
import { mjml2html } from 'mjml'

import { Registered } from '../both/collections';

const htmlOutput = mjml2html(`
  <mjml>
    <mj-body>
      <mj-container>
        <mj-section>
          <mj-column>
            <mj-text>
              Hello World!
            </mj-text>
          </mj-column>
        </mj-section>
      </mj-container>
    </mj-body>
  </mjml>
`);

Meteor.startup(() => {
    process.env.MAIL_URL = 'smtp://thomaster:mangrove2016@smtp.sendgrid.net:587';

    Tracker.autorun(() => {
        Meteor.setTimeout(() => {
            if(moment().hours() === 10){
                Registered.find({}).fetch().forEach((register) => {
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
        }, 3600000)
    });
});

