var debugLogs = true;
let welcomeTextElem;

if (debugLogs) {
  console.log("main.js loaded...");
}

let paramCategory = "home" /* Page type – available values are "home", "thesis", "senior", "item" */
let paramProjectID; /* Project ID */
let mainDisplayElem; /* "Main" content section element of any page */

window.addEventListener('DOMContentLoaded', initPage);

function initPage(event) {

  /* Behaviors to construct the current page */

  if (debugLogs) {
    console.log("Firing initPage()...");
  }
  if (debugLogs) {
    console.log("paramCategory is: " + paramCategory);
  }
  if (debugLogs) {
    console.log(projectCollection);
  }

  /* Dynamic page color */
  let newRandomGradientColorA_R = Math.floor(240 + Math.random()*10);
  let newRandomGradientColorA_G = Math.floor(230 + Math.random()*10);
  let newRandomGradientColorA_B = Math.floor(240 + Math.random()*10);
  let newRandomGradientColorB_R = Math.floor(240 + Math.random()*10);
  let newRandomGradientColorB_G = Math.floor(230 + Math.random()*10);
  let newRandomGradientColorB_B = Math.floor(240 + Math.random()*10);
  let colorAString = "rgba(" + newRandomGradientColorA_R + "," + newRandomGradientColorA_G + "," + newRandomGradientColorA_B + ")";
  let colorBString = "rgba(" + newRandomGradientColorB_R + "," + newRandomGradientColorB_G + "," + newRandomGradientColorB_B + ")";
  document.documentElement.style.setProperty('--gradientColorA', colorAString);
  document.documentElement.style.setProperty('--gradientColorB', colorBString);

  /* Determine the requested category (page type) */
  const queryString = window.location.search; /* Example: ?product=shirt&color=blue&newuser&size=m */
  const urlParams = new URLSearchParams(queryString);
  const parsedSiteCatParam = urlParams.get('cat');
  if (parsedSiteCatParam != "" && parsedSiteCatParam != null) {
    paramCategory = parsedSiteCatParam
  };

  /* Determine the requested project ID if appropriate */
  const parsedSiteProjectIDParam = urlParams.get('id');
  paramProjectID = parsedSiteProjectIDParam;

  if (debugLogs) {
    console.log("paramCategory is: " + paramCategory);
    console.log("paramProjectID is: " + paramProjectID);
  }

  /* References to necessary page elements */
  mainDisplayElem = document.getElementById('mainDisplay');
  welcomeTextElem = document.getElementById('welcomeText');

  /* Behaviors for different page types */
  if (paramCategory === "home") {
    produceProjectDirectoryPage();
  }
  if (paramCategory === "item") {
    produceProjectItemPage();
    welcomeTextElem.remove();
  }

}

function produceProjectDirectoryPage() {

  /* Creates a project list from the corresponding JSON collection
     and adds those new elements to the page. */

  if (debugLogs) {
    console.log("Producing directory...")
  };

  for (var i = 0; i < projectCollection["projects"].length; i++) {
    if (debugLogs) {
      console.log(projectCollection["projects"][i])
    };
    let newProjectLinkElement = produceProjectDirectoryLink(projectCollection["projects"][i]);
    mainDisplayElem.appendChild(newProjectLinkElement)
  }
}

function produceProjectItemPage() {

  if (debugLogs) {
    console.log("Producing item page...")
  };

  /* Loop through collection to find matching project item */
  for (var i = 0; i < projectCollection["projects"].length; i++) {
    console.log("ID:" + projectCollection["projects"][i]["project_id"] + " - PARAM: " + paramProjectID);
    if (projectCollection["projects"][i]["project_id"] == paramProjectID) {
      console.log("Got a match...");
      let newProjectItemElement = produceItemContent(projectCollection["projects"][i]);
      mainDisplayElem.appendChild(newProjectItemElement);
    }
  }
}

function produceProjectDirectoryLink(projectJSON) {

  /* Returns an element link for the given incoming `projectJSON` */

  if (debugLogs) {
    // console.log("Producing link for following project JSON:");
  }

  let linkParagraphElement = document.createElement('p');
  let linkElement = document.createElement('a');
  linkElement.textContent = projectJSON["student_name"] + " – " + projectJSON["project_title"];
  linkElement.href = "?cat=item&id=" + projectJSON["project_id"];
  linkParagraphElement.appendChild(linkElement);
  return linkParagraphElement;

}

function produceItemContent(projectJSON) {

  /* Create new project item content */

  console.log(projectJSON);

  if (debugLogs) {
    console.log("Producing item CONTENT...")
  };

  let projectElem = document.createElement('article');
  let projectStudentElem = document.createElement('h2');
  let projectTitleElem = document.createElement('h3');
  let projectMainImageElem = document.createElement('img');
  let projectExternalLinkElem = document.createElement('a');
  let projectDescriptionElem = document.createElement('section');
  projectDescriptionElem.classList.add("projectDescription");
  let projectVideoEmbedElem = document.createElement('section');
  let projectAdditionalMediaElem = document.createElement('section');
  projectAdditionalMediaElem.classList.add("additionalMediaCollection");

  /* Student Name */
  projectStudentElem.textContent = projectJSON["student_name"];
  projectElem.appendChild(projectStudentElem);

  /* Project Title */
  projectTitleElem.textContent = projectJSON["project_title"];
  projectElem.appendChild(projectTitleElem);

  /* Project Main Image */
  projectMainImageElem.src = "/projectmedia/" + projectJSON["project_id"] + "/main.jpg"; /* OUTPUT: `/projectmedia/95/main.jpg` */
  projectMainImageElem.classList.add("projectMainImage");
  /* PLACEHOLDER */ projectMainImageElem.src = "https://picsum.photos/1280/720";
  projectElem.appendChild(projectMainImageElem);

  /* Project Description */
  for (var i = 0; i < projectJSON["project_description_paragraphs"].length; i++) {
    let newParagraph = document.createElement('p');
    newParagraph.textContent = projectJSON["project_description_paragraphs"][i];
    projectDescriptionElem.appendChild(newParagraph);
  }
  projectElem.appendChild(projectDescriptionElem);

  /* Project Additional Media */
  if (projectExternalLinkElem != "" && projectExternalLinkElem != null) {
    projectExternalLinkElem.href = projectJSON["project_external_url"];
    projectExternalLinkElem.textContent = projectJSON["project_external_url"];
    projectElem.appendChild(projectExternalLinkElem);
    // PRODUCE IFRAME EMBED BASED ON YOUTUBE OR VIMEO REGEX?
  }

  /* Project Additional Media */
  if (projectJSON["project_additional_media_files"].length > 0) {
    for (var i = 0; i < projectJSON["project_additional_media_files"].length; i++) {
      /* Create Link */
      let newMediaLink = document.createElement('a');
      newMediaLink.href = "/projectmedia/" + projectJSON["project_id"] + "/" + projectJSON["project_additional_media_files"][i]; /* OUTPUT: `/projectmedia/95/my_photo.jpg` */
      newMediaLink.target = "_blank";
      /* Create thumbnail and add inside of link */
      let newMediaThumbnailImg = document.createElement('img');
      // newMediaThumbnailImg.src = newMediaLink.href;
      /* PLACEHOLDER */ newMediaThumbnailImg.src = "https://picsum.photos/" + (1000 + (Math.floor(Math.random()*1000))) + "/" + (300 + (Math.floor(Math.random()*1000)));
      newMediaLink.appendChild(newMediaThumbnailImg);
      /* Add to additional media section */
      projectAdditionalMediaElem.appendChild(newMediaLink);
    }
    projectElem.appendChild(projectAdditionalMediaElem);
  }

  // for (var i = 0; i < projectJSON[project_additional_media_files].length; i++) {
  //
  // }
  /* OUTPUT: `/projectmedia/95/myPhoto.jpg` */

  return projectElem;

}
