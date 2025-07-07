### AIDocs4U Planning Document

## I need to create website and an application for my company called AIDocs4U.

## Mission: 
- Our company provides a solution for searching and analyzing private personal documents using AI techiniques without 
exposing the personal data outside of our customer's local computer. 

## Coding Specs:
- Apps should use javascript ES6 using import not require in .mjs files. 
- Create client scripts in a client folder e.g. client/index.html and server scripts in a server folder e.g. server/server.mjs. 
- For each script including launch.json provide the filename preceded by "### File: ". 
- On the next line show the code. 
- On the next line show the explanation of what the code does. 
- When importing javascript files use the filename and extension. 
- Show the folder structure diagram including the filenames. 
- Provide instructions for installing node modules and for execution and debugging for client and server in VSCode.  
- For these instructions provide a heading of "### Instructions: ". 
- We are  using node version 20+. 

## Server: 
- We have setup a linux server on the cloud with NGINX, Express and a MySql database installed. 
- A shell aidocs4u.com exists with an SSL certificate. See attached --aidics4u-old.jpg

## Web: 
- We have registered aidocs4u.com. 
- We will need a website that uses the attached file, --aidocs-logo.jpg, as a logo. 
- We need the site to be responsive.
- We need to toggle to and from Dark Mode
- We need a home page with a menu bar and footer. 
- The menu bar needs to include processes for Sign In and Sign Up which use the mysql database on our server. Use the 
attached file, -- login-example.jpg, as an example
- The menu bar should contain a language button to change language.
- Other menu options should open pages with content as follows: 
- Pricing - opens a pricing descriptions page
- Services - open a floating menu with multiple choices to be determined
- Explore - opens a floating menu with 2 choices "How We Got Here" and "What Our Customer Say"
- Support - opens a floating menu with 3 choices "Knowledge Base", "Tutorials" and "Contact Us"
- The footer  bar uses this attached example: --footer-example.jpg

## Client App:
- The client compter will be an Apple Mac Mini with a Silicon processor. 
- Our application will be installed via a USB drive. Also installed with our app will be Ollama and 5 models.
- The client will upload personal documents to this Mac Mini.

We need a client application that has these features:
- Has our logo: --aidocs-logo.jpg
- Sign In Sign Up
- DropDown "Type of Search" with these choices: "Local Model Only", "My Documents Only", "My Documents + Local Model"
- Check Box up to 5 models (ollama installed)
- Document Folders: Create, Modify and Delete Document Folders. User must be able to Upload Documents from their local drive.
- "AI Process Documents" button (embedding)
- Toggle "Use Internet" between "Yes" and "No"
- Toggle  "Scoring" between "Yes" and "No"
- User prompt
- Arrow button (to execute prompt)
- There should be a menu Dropdown for:  "Settings", "Update Software", "Toggle Dark Mode"
- Client should finalize into an electron app.

## Existing Client Coding:
We have existing code that usesexpects that all selections above will be stored in varables that our code can reference:
- We execute the client prompt and store the results in an existing MySql database using the variables provided.
- Please use the terms "existingsearch.mjs and existingscoring.mjs" when these are to be called in your client app
\