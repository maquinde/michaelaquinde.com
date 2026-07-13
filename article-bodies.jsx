// article-bodies.jsx — long-form body content for each writing entry, keyed by slug.
// Block types the article template renders: p | h | code | ul | quote | img.
// Exposed on window.V3_ARTICLES so Article.html can look up by ?p=<slug>.
(function () {
  const ARTICLES = {
    "flaws2-level1": {
      dek: "Playing the attacker in flaws2.cloud. We bypass a client-side check, extract temporary AWS credentials from a verbose error, and use them to read a private S3 bucket.",
      body: [
        { t: "img", src: "images/flaws2-level1-inline-1.png", alt: "flAWS 2 challenge landing page" },
        { t: "p", c: "flaws2.cloud is a free, intentionally vulnerable AWS training environment built by Scott Piper. It has two tracks, attacker and defender, and it teaches cloud security by letting you actually exploit the misconfigurations instead of just reading about them. In this post I play the attacker side of Level 1, where the goal is to get past a login screen and read a protected S3 bucket." },
        { t: "p", c: "If you want to follow along, start at the challenge and pick Attacker. A quick heads-up on credentials: everything you extract here is a short-lived STS session token that expires fast and belongs to a throwaway training account, so I have redacted the values below. Never paste real leaked keys into a public writeup." },

        { t: "h", c: "The Setup" },
        { t: "p", c: "Level 1 presents a screen asking for a code that the instructions say is \"100 digits long.\" Two ways to win: find the code, or bypass the check entirely. We go for the bypass." },
        { t: "img", src: "images/flaws2-level1-inline-2.png", alt: "flaws2.cloud Level 1 PIN code challenge" },

        { t: "h", c: "Step 1: Watch the Request" },
        { t: "p", c: "First, submit a few random digits just to see the behavior. Then open your browser's developer tools (F12) and switch to the Network tab. Submit again and inspect what actually goes over the wire." },
        { t: "img", src: "images/flaws2-level1-inline-3.png", alt: "flaws2.cloud Level 1 with random digits submitted as the code" },
        { t: "img", src: "images/flaws2-level1-inline-4.png", alt: "Browser Network tab showing the request after submitting an incorrect code" },

        { t: "h", c: "Step 2: Break the Assumption" },
        { t: "p", c: "The instructions say the code is 100 digits. So what happens if we submit a letter instead? Try it, and a JavaScript popup blocks the submission." },
        { t: "img", src: "images/flaws2-level1-inline-5.png", alt: "JavaScript alert reading Code must be a number after submitting a letter" },
        { t: "p", c: "That popup is the tell. It is a client-side validation check, which means it only runs in your browser and can be trivially bypassed. The server never sees it." },

        { t: "h", c: "Step 3: Bypass the Client-Side Check" },
        { t: "p", c: "In the Network tab, right-click the submitted request and choose Edit and Resend (Firefox makes this easy). Change the code parameter to a single character and send it." },
        { t: "img", src: "images/flaws2-level1-inline-6.png", alt: "Edit and Resend panel showing the code parameter changed to a single character, resulting in a 500 response" },
        { t: "p", c: "This time the server responds with a 500 Internal Server Error. A 500 means the backend choked on our unexpected input, and a crashing backend often leaks more than it should." },

        { t: "h", c: "Step 4: Read the Verbose Error" },
        { t: "p", c: "Following the request's initiator into the response, the error dump contains exactly what an attacker dreams of: a full set of temporary AWS credentials that were injected into the Lambda's environment." },
        { t: "img", src: "images/flaws2-level1-inline-7.png", alt: "Raw 500 response body showing leaked AWS Lambda environment variables including access key, secret key, and session token" },
        { t: "code", c: "AWS_ACCESS_KEY_ID: ASIA...REDACTED\nAWS_SECRET_ACCESS_KEY: ...REDACTED\nAWS_SESSION_TOKEN: ...REDACTED\nAWS_REGION: us-east-1" },
        { t: "p", c: "The lesson here: verbose error messages that expose environment variables are a serious information-disclosure flaw. The backend should return a generic error and log the details privately." },

        { t: "h", c: "Step 5: Use the Stolen Credentials" },
        { t: "p", c: "Install the AWS CLI, then load the leaked credentials into a named profile so we do not pollute our real config:" },
        { t: "code", c: "# Configure a throwaway profile with the leaked temporary credentials.\n# You will also need to add aws_session_token, since these are STS creds.\naws configure --profile flaws2-level1" },
        { t: "p", c: "Next, fingerprint the target to confirm what we are dealing with:" },
        { t: "code", c: "# -I fetches headers only. The Server header reveals this is AmazonS3.\ncurl -I http://level1.flaws2.cloud" },
        { t: "img", src: "images/flaws2-level1-inline-8.png", alt: "Terminal output of curl -I against level1.flaws2.cloud showing the Server: AmazonS3 header" },
        { t: "p", c: "The response confirms the site is hosted on S3. Now we test whether our stolen identity can list the bucket:" },
        { t: "code", c: "# List the bucket contents using the compromised credentials.\naws s3 ls s3://level1.flaws2.cloud --profile flaws2-level1" },
        { t: "img", src: "images/flaws2-level1-inline-9.png", alt: "Terminal output listing the level1.flaws2.cloud bucket contents, including a secret HTML file" },
        { t: "p", c: "Access granted. And right there in the listing is an object named secret." },

        { t: "h", c: "Step 6: Grab the Loot" },
        { t: "code", c: "# Copy the secret object to stdout (the trailing - streams it to the terminal).\naws s3 cp s3://level1.flaws2.cloud/secret-REDACTED.html - --profile flaws2-level1" },
        { t: "img", src: "images/flaws2-level1-inline-10.png", alt: "Level 1 secret page revealing the URL for Level 2" },
        { t: "p", c: "(You can also just open the object URL in a browser.) The file hands us the URL for Level 2." },

        { t: "h", c: "What Just Happened" },
        { t: "p", c: "In six steps we chained three separate weaknesses:" },
        { t: "ul", c: [
          "Client-side-only validation. The 100-digit check ran in the browser, so it was bypassable with Edit and Resend",
          "Verbose error handling. A 500 error leaked live AWS credentials from the Lambda environment",
          "Over-permissioned credentials. Those credentials could list and read a private S3 bucket",
        ] },
        { t: "p", c: "Any one of these alone is a finding. Chained together, they turn a login screen into full bucket access. That is the real lesson of cloud security: attackers do not need a single catastrophic bug, just a few small ones lined up." },

        { t: "h", c: "Defender Takeaways" },
        { t: "ul", c: [
          "Validate on the server, always. Client-side checks are UX, not security",
          "Return generic errors to users; log the details somewhere private",
          "Scope credentials tightly. The Lambda role should not have had read access to that bucket if it did not need it",
          "Rotate and time-box credentials, which STS tokens do by default, limiting the blast radius",
        ] },
        { t: "p", c: "In the next post I will work through Level 2, where things get more interesting. Same target, deeper access." },
      ],
    },
    "identity-management-cognito": {
      dek: "A hands-on walkthrough of building a university portal login system with Cognito: MFA enforcement, custom password policies, role-based groups, and OIDC integration with a React frontend.",
      body: [
        { t: "p", c: "Identity is the new perimeter. Before an attacker ever touches your data, they touch your login page, which makes authentication one of the highest-value places to invest security effort. In this project I built a complete identity system for a simulated university portal using Amazon Cognito: students and professors sign in with MFA, strong password policies are enforced, and role-based groups set the stage for least-privilege access to backend data." },
        { t: "p", c: "Here is the full walkthrough." },

        { t: "h", c: "Architecture at a Glance" },
        { t: "p", c: "The flow: User → React frontend → Cognito Hosted UI (OIDC) → JWT tokens → group-based authorization." },
        { t: "p", c: "Services used:" },
        { t: "ul", c: [
          "Amazon Cognito User Pool handles authentication, MFA, and group management",
          "Cognito App Client + Hosted Domain provide standards-based login pages",
          "AWS IAM maps groups to permissions (read-only for students, read/write for professors)",
          "React + react-oidc-context for the frontend integration",
        ] },
        { t: "p", c: "Time: 3 to 4 hours. Cost: free under the AWS Free Tier." },
        { t: "p", c: "Key terms upfront:" },
        { t: "ul", c: [
          "User Pool: Cognito's user directory, where accounts, passwords, and MFA live",
          "OIDC (OpenID Connect): the standard protocol that lets your app delegate login to Cognito",
          "JWT: the signed token your app receives after login, proving who the user is and what groups they belong to",
        ] },

        { t: "h", c: "Step 1: Create the User Pool" },
        { t: "ul", c: [
          "In the Cognito console, click User pools → Create user pool",
          "Application type: Traditional web application. Name it something like UniversityPortalUsers",
          "Sign-in identifier: Email only. Required attributes: Email",
          "Optionally add a return URL (http://localhost:3000 for local testing)",
          "Click Create user directory",
        ] },

        { t: "h", c: "Step 2: Harden the Security Settings" },
        { t: "p", c: "This is where the project earns its \"security\" label." },
        { t: "p", c: "Enforce MFA:" },
        { t: "ul", c: [
          "Go to Authentication → Sign-in → Multi-factor authentication → Edit",
          "Set enforcement to Required",
          "Choose TOTP (authenticator app) as the second factor. TOTP is preferable to SMS, which is vulnerable to SIM-swapping",
        ] },
        { t: "p", c: "Set a custom password policy:" },
        { t: "ul", c: [
          "Go to Authentication → Authentication methods → Password policy",
          "Mode: Custom, minimum 8 characters, require uppercase, lowercase, number, and special character",
          "Temporary password validity: 7 days",
        ] },
        { t: "p", c: "Enable account recovery:" },
        { t: "ul", c: [
          "Under User account recovery, enable self-service recovery",
          "Set Email as the preferred delivery method",
        ] },

        { t: "h", c: "Step 3: Create Role-Based Groups" },
        { t: "p", c: "Groups are how Cognito supports RBAC. Group membership shows up as a claim inside the JWT, so your backend can make authorization decisions without extra lookups." },
        { t: "ul", c: [
          "Go to User management → Groups → Create group",
          "Create Students (later mapped to read-only data access)",
          "Create Professors (later mapped to read/write access)",
        ] },
        { t: "p", c: "IAM roles get attached to these groups when you wire up backend APIs. For now the groups just tag identities with their role." },

        { t: "h", c: "Step 4: Configure the App Client and Hosted Domain" },
        { t: "p", c: "The App Client represents your application; the hosted domain gives you a ready-made, Cognito-managed login page." },
        { t: "ul", c: [
          "In App clients, verify the client that was auto-created with your pool",
          "Open the Login pages tab → Managed login pages configuration",
          "Set both the Callback URL and Sign-out URL to http://localhost:3000 for local testing, then save",
          "Under Branding → Domain, confirm a Cognito domain exists (e.g., yourprefix.auth.us-east-1.amazoncognito.com). If not, create one with a unique prefix",
        ] },

        { t: "h", c: "Step 5: Create Test Users and Assign Groups" },
        { t: "ul", c: [
          "Go to User management → Users → Create user",
          "Create student01@example.com with a temporary password, marking the email verified for quick testing",
          "Open the user, scroll to Group memberships → Add to group, and add them to Students",
          "Repeat with professor01@example.com in the Professors group",
        ] },

        { t: "h", c: "Step 6: Integrate the React Frontend via OIDC" },
        { t: "p", c: "Scaffold the app:" },
        { t: "code", c: "npx create-react-app university-portal\ncd university-portal\nnpm start" },
        { t: "p", c: "In the Cognito console, open App client → Quick setup guide. AWS generates working index.js and App.js code using react-oidc-context with your exact authority, client_id, and redirect URIs already filled in. Copy that code into your project and restart the dev server." },
        { t: "p", c: "Test the full flow:" },
        { t: "ul", c: [
          "Open http://localhost:3000 and click Sign In",
          "You are redirected to the Cognito-hosted login page",
          "Log in as the test student. Cognito forces a password reset and MFA enrollment (scan the QR code with an authenticator app)",
          "After MFA setup, Cognito redirects back with valid JWT tokens",
          "Sign out and verify the session ends",
        ] },
        { t: "p", c: "That forced password-reset-plus-MFA-enrollment flow on first login is exactly what you want: no user enters the system without a strong credential and a second factor." },

        { t: "h", c: "Production Notes" },
        { t: "p", c: "The lab keeps things simple, but a few things change before this pattern ships:" },
        { t: "ul", c: [
          "Never display tokens in the UI. Store them in httpOnly cookies rather than localStorage",
          "HTTPS everywhere. Localhost is fine for testing only",
          "Limit OAuth scopes to what the app needs (openid, email)",
          "Link identities to records with custom attributes like StudentID instead of storing sensitive data (grades, assignments) in Cognito itself. Cognito authenticates; your database authorizes",
        ] },

        { t: "h", c: "Cleanup" },
        { t: "ul", c: [
          "Delete the Cognito User Pool (this removes users, groups, and the app client)",
          "Remove any extra test app clients",
          "Confirm no hosted domains remain",
        ] },

        { t: "h", c: "Key Takeaways" },
        { t: "ul", c: [
          "MFA required, not optional. Enforcing TOTP at the pool level means no account can skip it",
          "RBAC through groups. Group claims in the JWT give your backend clean, token-based authorization",
          "Standards over custom code. OIDC with the hosted UI means no hand-rolled login forms and no password handling in your app",
          "Separation of concerns. Cognito owns authentication; your data layer owns authorization",
        ] },
        { t: "p", c: "This pattern maps directly to real identity work: it is the same OIDC flow enterprises run through Okta or Entra ID, just with AWS-native tooling. If you understand this project, you understand the core of modern SSO." },
      ],
    },
    "secure-serverless-website": {
      dek: "A step-by-step walkthrough of hosting a static site the secure way: private S3 bucket, CloudFront with Origin Access Control, AWS WAF managed rules, least-privilege IAM, and monitoring with CloudWatch and CloudTrail.",
      body: [
        { t: "p", c: "Most \"host a static site on S3\" tutorials tell you to make the bucket public. That works, but it is not how you would do it in production, and it is definitely not how a security engineer should do it. In this project I built a secure, serverless website architecture where the S3 bucket stays completely private, CloudFront is the only allowed reader, AWS WAF filters malicious traffic at the edge, and everything is auditable." },
        { t: "p", c: "Here is the full walkthrough." },

        { t: "h", c: "Architecture at a Glance" },
        { t: "p", c: "The flow: User → CloudFront (HTTPS enforced) → WAF inspection → Origin Access Control → private S3 bucket." },
        { t: "p", c: "Services used:" },
        { t: "ul", c: [
          "Amazon S3 stores the static site files (HTML, CSS, JS)",
          "Amazon CloudFront delivers content globally over HTTPS",
          "AWS WAF blocks SQL injection, XSS, and known bad traffic",
          "AWS IAM enforces least-privilege access for administration",
          "CloudWatch and CloudTrail provide monitoring and an audit trail",
        ] },
        { t: "p", c: "Time: 1 to 2 hours. Cost: roughly $0.50 to $1.50 if you clean up afterward." },

        { t: "h", c: "Step 1: Create a Private S3 Bucket" },
        { t: "p", c: "The key decision here: the bucket never becomes public." },
        { t: "ul", c: [
          "In the S3 console, click Create bucket",
          "Give it a globally unique name (e.g., my-site-website) and pick a region close to your users",
          "Leave Block all public access enabled (the default)",
          "Leave versioning, tags, and encryption at defaults and create the bucket",
          "Open the bucket and Upload your site files (index.html, web.css, web.js)",
        ] },
        { t: "p", c: "Why this matters: with public access blocked, nobody can hit your objects directly over the internet. CloudFront, via Origin Access Control, will be the only path in." },

        { t: "h", c: "Step 2: Set Up CloudFront with Origin Access Control" },
        { t: "p", c: "CloudFront caches your content at edge locations worldwide and terminates TLS for you." },
        { t: "ul", c: [
          "In CloudFront, go to Distributions → Create Distribution",
          "Origin type: Amazon S3. Origin domain: select your bucket's REST endpoint (bucket.s3.region.amazonaws.com), not the S3 website endpoint. The website endpoint cannot enforce HTTPS to the origin",
          "Keep private S3 bucket access via OAC enabled so only CloudFront can fetch objects",
          "Viewer protocol policy: Redirect HTTP to HTTPS",
          "Allowed HTTP methods: GET, HEAD only (a static site needs nothing else)",
          "Cache policy: CachingOptimized",
          "Skip WAF for now (we attach it manually in Step 3) and create the distribution",
        ] },
        { t: "p", c: "Then wire up the bucket policy:" },
        { t: "ul", c: [
          "In the distribution, go to Origins → Edit origin → Origin access control and copy the generated bucket policy",
          "Paste it into S3 → your bucket → Permissions → Bucket policy and save",
          "Back in CloudFront, set Default root object to index.html",
        ] },
        { t: "p", c: "After 5 to 10 minutes, your site loads at https://dxxxxxxxx.cloudfront.net over HTTPS. Try hitting the S3 URL directly and you get Access Denied, which is exactly what you want." },

        { t: "h", c: "Step 3: Attach AWS WAF" },
        { t: "p", c: "WAF inspects requests at the edge before they ever reach your origin." },
        { t: "ul", c: [
          "Open WAF & Shield → Web ACLs → Create web ACL",
          "Resource type: Global (CloudFront distributions are global resources regardless of your bucket's region)",
          "Name it, then under Associated AWS resources, add your CloudFront distribution",
          "Click Add rules → Add managed rule groups and select the Core rule set (covers SQLi and XSS patterns), and optionally the Amazon IP reputation list and Known bad inputs",
          "Default action: Allow requests that do not match rules. Never default to Block on a public site or you lock out legitimate users",
          "Create the Web ACL",
        ] },
        { t: "p", c: "Cost note: each managed rule group adds cost. The Core rule set alone is plenty for a learning project." },
        { t: "p", c: "Validate it works: append a script injection payload to your CloudFront URL, something like /?q=<script>alert(1)</script>. WAF should return a 403 Forbidden. Seeing that block confirms the Core rule set is actively inspecting traffic." },

        { t: "h", c: "Step 4: Least-Privilege IAM Access" },
        { t: "p", c: "Stop using the root account for day-to-day work." },
        { t: "ul", c: [
          "In IAM → Users → Add user, create a dedicated admin user with console access and a forced password reset on first sign-in",
          "Attach only the policies the project needs: S3, CloudFront, and WAF management, plus read-only IAM",
          "Create the user and store the sign-in URL and credentials securely",
          "Under Security credentials → Enable MFA, register an authenticator app",
        ] },
        { t: "p", c: "Improvement worth calling out: the managed FullAccess policies used here are a starting point. In a real environment I would scope these to the specific bucket and distribution ARNs. Broad managed policies are convenient for labs but they are not least privilege." },

        { t: "h", c: "Step 5: Monitoring and Compliance" },
        { t: "p", c: "Three services, three jobs. This is the mental model I use:" },
        { t: "ul", c: [
          "CloudWatch = operational monitoring. Metrics, alarms on request spikes or error rates, centralized logs",
          "CloudTrail = audit logging. Every API call recorded, answering \"who did what and when\"",
          "AWS Config = compliance checks. Continuously evaluates resource configuration against rules like \"all buckets must block public access\"",
        ] },
        { t: "p", c: "For a broader security posture, Security Hub aggregates findings, GuardDuty adds threat detection, and AWS Artifact supplies compliance reports (SOC, ISO, HIPAA) when auditors come knocking." },

        { t: "h", c: "Cleanup" },
        { t: "p", c: "To avoid surprise charges, tear down in this order:" },
        { t: "ul", c: [
          "Disable and delete the CloudFront distribution",
          "Empty and delete the S3 bucket",
          "Delete the WAF Web ACL",
          "Remove any CloudWatch alarms or log groups",
          "Delete the project-specific IAM user and policies",
        ] },

        { t: "h", c: "Key Takeaways" },
        { t: "ul", c: [
          "Private by default. The bucket never goes public; OAC makes CloudFront the sole reader",
          "Encrypt in transit. Redirecting HTTP to HTTPS at the viewer layer is a one-click win",
          "Filter at the edge. WAF blocks SQLi and XSS before requests reach your infrastructure",
          "Least privilege plus MFA. Dedicated IAM users, scoped permissions, no root account",
          "Log everything. CloudTrail and CloudWatch turn a static site into an auditable system",
        ] },
        { t: "p", c: "This pattern (S3 + CloudFront + OAC + WAF) is the foundation for nearly every secure static hosting setup on AWS, and it maps directly to controls you will see in SOC 2 and HIPAA environments: access restriction, encryption in transit, boundary protection, and audit logging." },
      ],
    },
    "build-a-vpc": {
      dek: "The VPC is the foundation everything else in AWS sits on. This walkthrough builds one from scratch twice — once in the console, once in CloudShell — and answers the \"why\" questions tutorials usually skip.",
      body: [
        { t: "p", c: "If you're starting out in cloud security or cloud engineering, the VPC is one of the first things you need to understand cold. It's the foundation everything else in AWS sits on top of: your EC2 instances, your databases, your load balancers. Get the VPC wrong, and everything built on it inherits the problem." },
        { t: "p", c: "This walkthrough builds a simple VPC from scratch, twice: once through the AWS console (so you can see what's happening), and once through CloudShell (so you can see how it's automated). Along the way, I'll answer the \"why\" questions that usually get skipped in tutorials." },

        { t: "h", c: "What is a VPC?" },
        { t: "p", c: "A VPC (Virtual Private Cloud) is your own private, isolated section of the AWS cloud. Think of it like renting an empty office floor in a shared building. AWS owns the building (their global data centers), but your floor is walled off. You decide who gets a key, how the rooms are laid out, and what's allowed in or out." },
        { t: "p", c: "Inside that \"floor,\" you control:" },
        { t: "ul", c: [
          "IP address ranges (who gets what address)",
          "Subnets (how the floor is divided into rooms)",
          "Routing (which hallways connect to which rooms, and to the outside)",
          "Security rules (who's allowed through which door)",
        ] },
        { t: "p", c: "Why would you want one? Because by default, nothing in AWS can talk to anything else, or to the internet, unless you explicitly allow it. A VPC gives you that control. It's the difference between leaving your office unlocked with no walls, and deciding exactly who can walk in, where they can go, and what they can access once they're there." },
        { t: "p", c: "For security engineers specifically, the VPC is where network segmentation, traffic control, and your \"deny by default\" posture actually get enforced." },

        { t: "h", c: "1. Create a VPC" },
        { t: "p", c: "Steps:" },
        { t: "ul", c: [
          "Type VPC in the AWS search bar and select VPC.",
          "In the left navigation menu, select Your VPCs.",
          "In the top right corner, select the AWS region closest to you. (You'll see a default VPC already listed here.)",
          "Choose Create VPC, then choose VPC Only.",
          "Name tag: My VPC — IPv4 CIDR: 10.0.0.0/16.",
          "Select Create VPC.",
        ] },
        { t: "p", c: "Why is there already a default VPC? AWS creates one default VPC per region automatically, so new accounts can launch resources (like an EC2 instance) immediately without configuring networking first. It comes pre-built with a subnet in each Availability Zone, an internet gateway already attached, and public IPs auto-assigned. It's convenient for quick testing, but in production you typically build custom VPCs (like the one above) so you control the design instead of inheriting AWS's defaults." },
        { t: "p", c: "What does that CIDR block mean? 10.0.0.0/16 defines your VPC's total address space, about 65,536 IP addresses. You'll carve smaller pieces out of this block for your subnets." },

        { t: "h", c: "What is a Subnet?" },
        { t: "p", c: "A subnet is a smaller, defined range of IP addresses within your VPC. Going back to the office analogy: if the VPC is the whole floor, a subnet is one room on that floor." },
        { t: "p", c: "Why would you need one? Because not everything on your floor should be treated the same way. Some rooms (subnets) should be reachable from outside, like a lobby. Others should stay locked down, like a server closet. Splitting your VPC into subnets is how you separate \"things the internet can reach\" (public subnets) from \"things that should never be directly exposed\" (private subnets), like databases." },

        { t: "h", c: "2. Create Subnets" },
        { t: "p", c: "Steps:" },
        { t: "ul", c: [
          "In the left navigation menu, select Subnets. (You'll see subnets already listed here too.)",
          "Choose Create subnet.",
          "VPC ID: select the VPC you just created.",
          "Subnet name: Public — Availability Zone: select the first one on the list.",
          "IPv4 VPC CIDR block: 10.0.0.0/16 — IPv4 subnet CIDR block: 10.0.0.0/24.",
          "Choose Create subnet.",
          "On the next screen, check the box next to Public.",
          "In the Actions menu (top right), select Edit subnet settings.",
          "Check the box for Enable auto-assign public IPv4 address, then click Save.",
        ] },
        { t: "p", c: "Why are subnets already listed there? Those are the subnets that came bundled with the default VPC, one per Availability Zone in that region. AWS pre-builds them for the same reason it pre-builds the default VPC: so you can launch something right away without setting up subnets manually." },
        { t: "p", c: "What does \"Enable auto-assign public IPv4 address\" actually do? It tells AWS to automatically give any instance launched in this subnet a public IP address. Without this setting, a new EC2 instance would only get a private IP, and nothing outside your VPC could reach it directly, even if everything else (routing, gateway) was set up correctly. This is what makes a subnet practically public, not just labeled \"Public.\"" },

        { t: "h", c: "What is an Internet Gateway?" },
        { t: "p", c: "An internet gateway is the door between your VPC and the public internet. Without it, your VPC is a sealed room. No traffic gets in, and nothing inside can reach the outside world, no matter how your subnets and routing are configured." },
        { t: "p", c: "Why would you need one? If you want any resource in your VPC (like a web server) to be reachable from the internet, or to reach out to the internet itself (like downloading updates), you need this gateway attached. It's the one piece that physically connects your private network to the outside." },

        { t: "h", c: "3. Create an Internet Gateway" },
        { t: "p", c: "Steps:" },
        { t: "ul", c: [
          "In the left navigation menu, select Internet Gateways. (You'll see one already listed, attached to the default VPC.)",
          "Choose Create internet gateway.",
          "Name tag: My VPC IG.",
          "Choose Create internet gateway.",
          "Select your newly created internet gateway, then choose Actions (top right corner).",
          "Select Attach to VPC, select My VPC, then select Attach internet gateway.",
        ] },
        { t: "p", c: "Why is there already an internet gateway? It's attached to the default VPC for the same reason that VPC has public subnets and auto-assign IPs turned on: AWS sets it up so resources are internet-reachable out of the box." },
        { t: "p", c: "What happens after attaching an internet gateway to a VPC? Attaching it just opens the door, it doesn't automatically route traffic through it. To actually use it, you need a route table entry that says \"send internet-bound traffic (0.0.0.0/0) to this gateway,\" and that route table needs to be associated with your public subnet. Without that routing step, the gateway sits attached but unused. (This routing step isn't in your original notes, but it's worth knowing as the next logical piece.)" },

        { t: "h", c: "4. Create a VPC with AWS CloudShell" },
        { t: "p", c: "Now let's do the same thing through the command line. This is useful because in real environments, networking gets built through code (Infrastructure as Code), not by clicking through a console every time. Open CloudShell from the AWS console, then:" },
        { t: "p", c: "Create the VPC — this returns your new VPC's ID. Save it, you'll need it in the next steps:" },
        { t: "code", c: "aws ec2 create-vpc --cidr-block 10.0.0.0/24 \\\n  --query Vpc.VpcId --output text" },
        { t: "p", c: "Tag the VPC with a name (replace VPC-ID with the ID returned above):" },
        { t: "code", c: "aws ec2 create-tags --resources VPC-ID \\\n  --tags Key=Name,Value=\"My VPC 2\"" },
        { t: "p", c: "Create a subnet inside that VPC. Replace VPC-ID with your VPC's ID, and ADD-CIDR-BLOCK-HERE with a smaller range inside your VPC's CIDR (for example, 10.0.0.0/25 if your VPC is 10.0.0.0/24):" },
        { t: "code", c: "aws ec2 create-subnet --vpc-id VPC-ID \\\n  --cidr-block ADD-CIDR-BLOCK-HERE" },
        { t: "p", c: "Go to your VPC in the console and select Resource Map to visually confirm what you just built. Then create an internet gateway and save the returned ID:" },
        { t: "code", c: "aws ec2 create-internet-gateway \\\n  --query InternetGateway.InternetGatewayId --output text" },
        { t: "p", c: "Attach the gateway to your VPC (replace VPC-ID and IG-ID with the values you saved):" },
        { t: "code", c: "aws ec2 attach-internet-gateway --vpc-id VPC-ID \\\n  --internet-gateway-id IG-ID" },

        { t: "h", c: "The takeaway" },
        { t: "p", c: "Every piece here builds on the last one:" },
        { t: "ul", c: [
          "VPC = your isolated network space.",
          "Subnet = a smaller zone inside that space, public or private.",
          "Internet Gateway = the door connecting your network to the internet.",
          "Route table (the missing piece worth remembering) = what actually tells traffic to use that door.",
        ] },
        { t: "quote", c: "An internet gateway just opens the door. A route table is what tells traffic to walk through it." },
        { t: "p", c: "Once you're comfortable building this manually, in both the console and the CLI, the natural next step is automating it with Infrastructure as Code (Terraform or CloudFormation) so your network design is repeatable and version-controlled instead of click-built every time." },
      ],
    },
  };

  window.V3_ARTICLES = ARTICLES;
})();
