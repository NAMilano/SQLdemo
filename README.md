*****DATABASE DEACTIVATED - NO LONGER MAINTAINED - NO LONGER FUNCTIONING*****

SQL Demo Project for CSI-3480 Security and Privacy in Computing

Fake bank login and create account web application to demenstrate SQL injections.

Featuring two branches:
Secure(Main) branch is fully protected from SQL injections aswell as implementing various proper coding techniques to ensure maximum security. 
Unsecure branch is susceptible to SQL injections and uses poor coding practices leaving many vulernabilities. 



Secure Branch (Main)
  - Uses prepared SQL statements
  - Implements input validation and sanitization
  - Strong password requirements
  - Password encryption
  - Use of enviromental variables inplace of credentials

Unsecure Branch
  - No SQL injection protection
  - Poor coding practices
  - Poor overall security




Instructions:
1. Open the repository in a code editor
2. Open the terminal
3. Run the command "npm install concurrently --save-dev"
4. Run the command "npm start"
5. Click on the local host link
