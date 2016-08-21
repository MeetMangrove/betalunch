/**
 * Created by thomas on 21/08/16.
 */

import { Meteor } from 'meteor/meteor';
import { mjml2html } from 'mjml';
import { Files } from '../both/collections';

const url = Meteor.settings.url;

export let askForMatchingHTML = (register) => {
    return mjml2html(`
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
};

export let matchingMailHTML1 = (peopleOne, peopleTwo) => {
    return mjml2html(`
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
};

export let matchingMailHTML2 = (peopleOne, peopleTwo, oddPeople) => {
    return mjml2html(`
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
                                         <mj-image width="150" border-radius="50%" src="${url}${Files.findOne({_id: peopleOne.picture}).url()}" />
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
};