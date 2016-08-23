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
                      <mj-image width="150" border-radius="50%" src="${url}${Files.findOne({_id: register.picture}).url()}" />
                      <mj-text align="center" font-size="24px">
                        Good morning ${register.name}!<br/> Do you want to have lunch with another betahaus member today?
                      </mj-text>
                    </mj-column>
                  </mj-section>
                  <mj-section>
                    <mj-group>
                      <mj-column>
                        <mj-button font-family="Helvetica" background-color="#8BC34A" color="white" inner-padding="20px" align="center" href="${url}/accept/${register._id}" padding="10px 5px">
                          Hell yes!
                        </mj-button>
                      </mj-column>
                      <mj-column>
                        <mj-button font-family="Helvetica" background-color="#FF5722" color="white" inner-padding="20px" align="center" href="${url}/reject/${register._id}" padding="10px 5px">
                          Not this time
                        </mj-button>
                      </mj-column>
                    </mj-group>
                  </mj-section>
                  <mj-divider border-width="1px" border-style="dashed" border-color="lightgrey" />
                  <mj-section>
                    <mj-group>
                      <mj-button font-family="Helvetica" background-color="#039be5" inner-padding="15px" padding-bottom="15px" color="white" href="${url}/reject_week/${register._id}">
                        I’m not available this week.
                      </mj-button>
                      <mj-spacer height="15px" />
                      <mj-button font-family="Helvetica" background-color="#039be5" inner-padding="15px" href="${url}/change_pairing_days/${register._id}">
                        I want to change my betalunch days.
                      </mj-button>
                      <mj-spacer height="15px" />
                      <mj-button font-family="Helvetica" background-color="#039be5" inner-padding="15px" color="white" href="${url}/unsubscribe/${register._id}">
                        I want to be unsubscribed.
                      </mj-button>
                    </mj-group>
                  </mj-section>
                  <mj-divider border-width="1px" border-style="dashed" border-color="lightgrey" />
                  <mj-section>
                    <mj-column>
                      <mj-social mode="horizontal" display="facebook twitter" facebook-content="betahaus" twitter-content="@betahaus" facebook-href="https://www.facebook.com/betahaus" twitter-href="https://twitter.com/betahaus" />
                    </mj-column>
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
                                    Get in touch with each other to meet for lunch:
                                  </mj-text>
                                </mj-column>
                              </mj-section>
                              <mj-section>
                                <mj-column>
                                  <mj-image width="150" border-radius="50%" src="${url}${Files.findOne({_id: peopleOne.picture}).url()}" />
                                  <mj-text font-size="20px" align="center">
                                    ${peopleOne.name}
                                  </mj-text>
                                  <mj-text font-size="18px" align="center" font-style="italic" color="#9E9E9E">
                                    ${peopleOne.number}
                                  </mj-text>
                                </mj-column>
                                <mj-column>
                                  <mj-image width="150" border-radius="50%" src="${url}${Files.findOne({_id: peopleTwo.picture}).url()}" />
                                  <mj-text font-size="20px" align="center">
                                    ${peopleTwo.name}
                                  </mj-text>
                                  <mj-text font-size="18px" align="center" font-style="italic" color="#9E9E9E">
                                    ${peopleTwo.number}
                                  </mj-text>
                                </mj-column>
                              </mj-section>
                              <mj-divider border-width="1px" border-style="dashed" border-color="lightgrey" />
                              <mj-section>
                                <mj-column>
                                  <mj-social mode="horizontal" display="facebook twitter" facebook-content="betahaus" twitter-content="@betahaus" facebook-href="https://www.facebook.com/betahaus" twitter-href="https://twitter.com/betahaus" />
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
                                    Get in touch with each other to meet for lunch:
                                  </mj-text>
                                </mj-column>
                              </mj-section>
                              <mj-section>
                                <mj-column>
                                  <mj-image width="150" border-radius="50%" src="${url}${Files.findOne({_id: peopleOne.picture}).url()}" />
                                  <mj-text font-size="20px" align="center">
                                    ${peopleOne.name}
                                  </mj-text>
                                  <mj-text font-size="18px" align="center" font-style="italic" color="#9E9E9E">
                                    ${peopleOne.number}
                                  </mj-text>
                                </mj-column>
                                <mj-column>
                                  <mj-image width="150" border-radius="50%" src="${url}${Files.findOne({_id: peopleTwo.picture}).url()}" />
                                  <mj-text font-size="20px" align="center">
                                    ${peopleTwo.name}
                                  </mj-text>
                                  <mj-text font-size="18px" align="center" font-style="italic" color="#9E9E9E">
                                    ${peopleTwo.number}
                                  </mj-text>
                                </mj-column>
                                <mj-column>
                                  <mj-image width="150" border-radius="50%" src="${url}${Files.findOne({_id: oddPeople.picture}).url()}" />
                                  <mj-text font-size="20px" align="center">
                                    ${oddPeople.name}
                                  </mj-text>
                                  <mj-text font-size="18px" align="center" font-style="italic" color="#9E9E9E">
                                    ${oddPeople.number}
                                  </mj-text>
                                </mj-column>
                              </mj-section>
                              <mj-divider border-width="1px" border-style="dashed" border-color="lightgrey" />
                              <mj-section>
                                <mj-column>
                                  <mj-social mode="horizontal" display="facebook twitter" facebook-content="betahaus" twitter-content="@betahaus" facebook-href="https://www.facebook.com/betahaus" twitter-href="https://twitter.com/betahaus" />
                                </mj-column>
                              </mj-section>
                            </mj-container>
                          </mj-body>
                        </mjml>
                        `);
};