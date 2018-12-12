import React, { Component } from 'react';

import { Title, TitleBar, BackButton } from '^/components/navigation';
import { Screen, TextContent } from '^/components/layout';
import ExternalLink from '^/components/links/ExternalLink';
import MailLink from '^/components/links/MailLink';

import './Privacy.scss';

class Privacy extends Component {
  render() {
    return (
      <Screen>
        <TitleBar>
          <BackButton defaultRoute="/" />
          <Title>Privacy</Title>
        </TitleBar>
        <TextContent white>
          
          <p>Last Updated: 26th November 2016</p>
          <p>Here at Clikd we believe in respecting people’s privacy and doing our best to work with our customers to get their best experience possible. We are not about spying on you or about stealing your data. We are here to give you a great and fun experience which respects your boundaries.  Here you can find out all the relevant information you will need about the </p>
          <p>This privacy policy (“Privacy Policy”) describes the information collected by Clikd Limited (“we,” “us,” or “our”), how that information may be used, with whom it may be shared, and your choices about such uses and disclosures. By using our website, located at <ExternalLink to="http://www.clickdapp.com">www.clikdapp.com</ExternalLink> (“Website”), our mobile apps, and/or other services we provide (collectively, “Clikd”), you are accepting the practices set forth in this Privacy Policy. If you do not agree with this policy, then you must not access or use Clikd or the website.</p>
          <p>We are registered in United Kingdom with the company number 10071260 and with the registered address. We operate under and are bound by the Personal Data Act (1998:204) and the Electronic Communications Act (2003:389) and we are registered as Data Controller in the UK’s Information Commissioners Office.</p>

          <h2>What do we collect</h2>

          <h3>Information if you are a visitor to our website</h3>

          <p>We don’t collect any personal information about visitors to our site. If you do visit us without becoming a member, we will place session ID cookies on your computer but that’s it.</p>
          <p>Information collected automatically: When you use Clikd, we automatically collect and store certain information about your computer or mobile device and your activities which is brought across through our systems. Sorry we need this to operate so if you don’t want us to have it, you need to avoid our app.</p>

          <ol>
            <li><p>GPS - Your mobile device's geographic location when you first register for Clikd through our mobile app.</p></li>
            <li><p>Mobile Device ID. Your mobile device's unique ID number (e.g., IMEI).</p></li>
            <li><p>Your Device Information & Specifications. Technical information about your computer or mobile device (e.g., type of device, web browser or operating system, IP address) to analyse trends, administer the site, prevent fraud, track visitor movement in the aggregate, and gather broad demographic information.</p></li>
            <li><p>Length and Extent of Usage of services and features you used.</p></li>
          </ol>

          <h3>Information you choose to provide:</h3>

          <p>Certain information we ask you to provide to us so that we can help you Clik with people. You don’t always have to give it to us, but most of the time you will get a better experience if you do. But if you have any issues with this, let us know and we can take a look at this. We don’t want to be overly intrusive – your life is just that, yours.</p>

          <ol>
            <li>
              <p><strong>The info you give us direct or fill in on our app.</strong>  In addition, when you register with certain Clikd apps, you must provide certain information, some of which comes across from facebook and other which you fill in yourself. This includes</p>
              <ul>
                <li><p>address, postcode, and gender.</p></li>
                <li><p>Education, current city</p></li>
                <li><p>sexuality or how you identify yourself</p></li>
                <li><p>identifiable info</p></li>
                <li><p>what you are looking for</p></li>
                <li><p>Categories of information you are interested in</p></li>
                <li><p>Your answers to our ‘questions’ / Test</p></li>
                <li><p>Your match information</p></li>
                <li><p>Photos of yourself/ profile photos</p></li>
              </ul>
              <p>Any information that you provide in the non-personal identifiable section of your profile will be viewable by your match.</p>
            </li>
            <li>
              <p><strong>Information We Obtain From Facebook.</strong> In order to register with the Clikd apps, you may be asked to sign in using your Facebook login.   By allowing us to access your Facebook account, you understand that we may obtain certain information from your Facebook account, including your name, email address, birthday, education history, current city, pictures stored on Facebook. We only obtain information from your Facebook account that you specifically authorize and grant us permission to obtain.</p>
            </li>
            <li>
              <p><strong>Emails:</strong> We require an email address from you when you register with us on our website and as part of the registration process to our App. We use your email for both “administrative” (e.g., confirming your registration, notifying of matches) and “promotional” (e.g., newsletters, new product offerings, special discounts, event notifications, special third-party offers) purposes. Email messages we send you may contain code that enables our database to track your usage of the e-mails, including whether the e-mail was opened and what links (if any) were clicked.  We will try and send you some cool stuff, but we appreciate that its not for everyone so we will give you the opportunity in every email to opt-out of receiving our emails.  But if you have any concerns or issues then you can contact us direct on contact@clikdapp.com and we will do our best to sort it.</p>
              <p>The only exception is right to send you certain communications relating to essential issues of using Clikd such as service announcements, security alerts, update notices, or other administrative messages.  Because if something scary happens like we get hacked or the site goes down, we need to be able to contact you, but we will do our best to keep it to a minimum, but if you're not happy about any of it do let us know!</p>
            </li>
            <li>
              <p><strong>Text Messages:</strong> We may require a mobile telephone number in order to connect you with your match. When both you and your match explicitly express mutual interest by both clicking the “LIKE” button within Clikd, we will seek to connect you with him/her by text message. We will also share your first name at this time with your match. We do not share your phone number with your match during this process, as all introductory text messages are sent using third party generated phone numbers. We may also send text messages to your mobile phone for purposes of communicating with you about Clikd. By registering with Clikd you hereby authorize us to send text messages to your mobile phone for any or all of the purposes set forth herein.</p>
            </li>
            <li>
              <p><strong>Online Survey Data:</strong> We may periodically conduct voluntary member surveys. If you're down to help us that is cool.   We promise not to abuse your feedback so we will keen the feedback separate to your name or email address, and all responses are anonymous.</p>
            </li>
          </ol>

          <h3>How we use the information</h3>
          <p>Pursuant to the terms of this Privacy Policy, we may use the information we collect from you for the following purposes:</p>

          <ol>
            <li><p>facilitate matches with other Clikd users;</p></li>
            <li><p>respond to your comments and questions and provide customer service;</p></li>
            <li><p>communicate with you about Clikd and related offers, promotions, news, upcoming events, and other information we think will be of interest to you;</p></li>
            <li><p>monitor and analyse trends, usage and activities;</p></li>
            <li><p>investigate and prevent fraud and other illegal activities; and</p></li>
            <li><p>provide, maintain, and improve Clikd and our overall business</p></li>
          </ol>

          <h3>Research Use of Data.</h3>
          <p>By using Clikd, you agree to allow us to anonymously use the information from you and your experiences to continue our research into successful relationships, including how to create and foster these relationships, so that we may continue to improve the Clikd.  Hopefully this will help you guys and we may also publish this research in our blogs or interviews. However, all of your responses will be kept anonymous, and we assure you that no personal information will be published.</p>

          <h3>Sharing Your Information</h3>
          <p>We won’t sell your personal data! That’s a promise. That is yours and you have shared it with us so we promise to keep it safe</p>
          <p>The information we do collect is used to improve the content and the quality of Clikd, and without your consent we will not otherwise share your personal information to/with any other party(s) for commercial purposes, except: (a) to provide the Clikd matching service, (b) when we have your permission, or (c) or under the following instances:</p>
          <p><strong>Service Providers.</strong> We may share your information with our third-party service providers that support various aspects of our business operations (e.g., analytics providers, security and technology providers, and payment processors).</p>
          <p><strong>Legal Disclosures and Business Transfers.</strong> We may disclose any information without notice or consent from you: (a) in response to a legal request, court order, or government information request; (b) to investigate or report illegal activity; or (c) to enforce our rights or defend claims. We may also transfer your information to another company in connection with a merger, corporate restructuring, sale of any or all of our assets, or in the event of bankruptcy.</p>
          <p><strong>Aggregate Data.</strong> We may combine non-PII we collect with additional non-PII collected from other sources for our blog. We also may share aggregated, non-PII with third parties, including advisors, advertisers and investors, for the purpose of conducting general business analysis and or targeting or recommending adverts.</p>

          <h3>Updating or Removing Account Information</h3>
          <p>You may review or edit your profile as you wish, by logging into your Clikd account using the information supplied during the registration process. If you would like to have us delete your account information, we may do so by deactivating your account first and then permanently deleting your account.</p>

          <h3>Third Party Sites</h3>
          <p>Clikd may contain links to other websites. If you choose to click on a third party link, you will be directed to that third party's website. The fact that we link to a website is not an endorsement, authorization or representation of our affiliation with that third party, nor is it an endorsement of their privacy or information security policies or practices. We do not exercise control over third party websites. These other websites may place their own cookies or other files on your computer, collect data or solicit personal information from you. Other websites follow different rules regarding the use or disclosure of the personal information you submit to them. We encourage you to read the privacy policies or statements of the other websites you visit.</p>

          <h3>Age Restriction</h3>
          <p>You can only become a member of Clikd if you're aged 18 or over or the age of majority in the country in which you reside if that happens to be greater than 18. That means Clikd does not knowingly collect any information about children, minors or anyone under the age of majority. Nor do we knowingly market to children, minors or anyone under the age of 18. If you are less than 18 years old, we request that you do not submit information to us.</p>
          <p>If we become aware that a child, minor or anyone under the age of 18 has registered with us and provided us with personal information, we will take steps to terminate that person’s registration and delete their Profile information from Clikd. If we do delete a Profile because you violated our no children rules, we may retain your email and IP address to ensure that you do not try to get around our rules by creating a new Profile.</p>

          <h3>Securing Your Personal Information</h3>
          <p>We endeavor to safeguard personal information to ensure that information is kept private. However, please be aware that unauthorized entry or use, hardware or software failure, the inherent insecurity of the Internet and other factors, may compromise the security of your personal information at any time. As such, we cannot guarantee the security of your personal information.</p>
          <p>Your information is stored on Amazon cloud in AWS servers in Ireland.  AWS maintains certification with robust security standards, such as ISO 27001, SOC 1/2/3 and PCI DSS Level 1. </p>
          <p>AWS has teams of Solutions Architects, Account Managers, Consultants, Trainers and other staff in the EU expertly trained on cloud security and compliance to assist AWS customers in achieving high levels of security and compliance in the Cloud, following Cloud Security Best Practices</p>

          <h3>Using Clikd from outside the United Kingdom</h3>
          <p>If you are visiting Clikd from outside the United Kingdom, please be aware that your information may be transferred to, stored, and processed in the United Kingdom where our servers are located and our central database is operated. By using our services, you understand and agree that your information may be transferred to our facilities and those third parties with whom we share it as described in this privacy policy.  Data will be stored and kept secure as to the standards prescribed to the </p>

          <h3>Changes to this Privacy Policy</h3>
          <p>All future changes we make to our Privacy Policy will be posted on this page. Where appropriate, we will also notify you about any changes via e-mail in accordance with the Terms and Conditions. Any changes shall be effective immediately apart from for existing members where such changes shall be effective 30 days after posting, unless otherwise stated.</p>

          <h3>Subject Access Request</h3>
          <p>As a data protection controller in the UK, you can make a subject access request in writing to <MailLink to="contact@clikdapp.com">contact@clikdapp.com</MailLink> and we will aim to locate and provide the applicable information within the required time frame. We reserve the right to charge you the statutory permissible fee for such a request.</p>

          <h3>How to Contact Us</h3>
          <p>Hopefully this has told you everything you need to know.  But we realise that despite our best endeavours we are not always perfect, so if you have any issues then please do get in touch and we will try to help you. You can contact us by email at <MailLink to="contact@clikdapp.com">contact@clikdapp.com</MailLink></p>

        </TextContent>
      </Screen>
    );
  }
}

export default Privacy;
