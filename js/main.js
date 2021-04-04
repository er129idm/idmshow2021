var debugLogs = true;
let welcomeTextElem;

if (debugLogs) {
  console.log("main.js loaded...");
}

/* ----- JSON KEY TRANSLATIONS ----- */

let pIDKey = "Net ID";
let sNameKey = "Full Name";
let pYearKey = "What year are you?";
let pTitleKey = "Title of your project";
let pMainURLKey = "Project Link";
let pShortDescKey = "Short Description of your work (1 sentence)";
let pLongDescKey = "Long Description of your work (4-6 sentences)";
let pHashtagsKey = "Project Hashtag #";
let pKeywordsKey = "Project Themes & Keywords";
let sPersonalURLKey = "Link to your personal portfolio";
let sLinkedinKey = "Linked In Handle";
let sInstagramKey = "Instagram Handle";
let sYoutubeKey = "Youtube";
let sTwitterKey = "Twitter Handle";
let pAdditionalMediaKey = "Supporting Images";

let pFreshmanValue = "Freshman";
let pSophmoreValue = "Sophmore"
let pJuniorValue = "Junior"
let pSeniorValue = "Senior (Senior Project)";
let pFirstGradValue = "First Year Grad";
let pThesisValue = "Second Year Grad (Thesis Project)";


/* ----- MAIN JS ----- */

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
  let newRandomGradientColorA_R = Math.floor(150 + Math.random() * 150);
  let newRandomGradientColorA_G = Math.floor(150 + Math.random() * 50);
  let newRandomGradientColorA_B = Math.floor(150 + Math.random() * 150);
  let newRandomGradientColorB_R = Math.floor(240 + Math.random() * 10);
  let newRandomGradientColorB_G = Math.floor(230 + Math.random() * 10);
  let newRandomGradientColorB_B = Math.floor(240 + Math.random() * 10);
  let colorAString = "rgba(" + newRandomGradientColorA_R + "," + newRandomGradientColorA_G + "," + newRandomGradientColorA_B + ")";
  let colorBString = "rgba(" + newRandomGradientColorB_R + "," + newRandomGradientColorB_G + "," + newRandomGradientColorB_B + ")";
  // document.documentElement.style.setProperty('--gradientColorA', colorAString);
  // document.documentElement.style.setProperty('--gradientColorB', colorBString);

  /* Set random header title background image */
  // let headerTitleElement = document.getElementById("headerTitle");
  // headerTitleElement.style.backgroundImage = "url('" + getRandomMainImageURL() + "')";

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

  /* Determine the requested Tag category value if appropriate */
  const parsedValParam = urlParams.get('val');
  parsedVal = parsedValParam;

  if (debugLogs) {
    console.log("paramCategory is: " + paramCategory);
    console.log("paramProjectID is: " + paramProjectID);
  }

  /* References to necessary page elements */
  mainDisplayElem = document.getElementById('mainDisplay');
  welcomeTextElem = document.getElementById('welcomeText');

  /* Behaviors for different page types */
  if (paramCategory === "home") {
    // produceProjectDirectoryPage();
  } else if (paramCategory === "thesis") {
    welcomeTextElem.remove();
    produceDirectoryOfCategory("thesis");
  } else if (paramCategory === "senior") {
    welcomeTextElem.remove();
    produceDirectoryOfCategory("senior");
  }
  else if (paramCategory === "tag") {
    welcomeTextElem.remove();
    produceDirectoryOfTag(parsedVal);
  }
  else if (paramCategory === "item") {
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

function produceDirectoryOfCategory(requestedCategory) {

  /* Creates a project list from the corresponding JSON collection
     and adds those new elements to the page. */

  console.log("Producing " + requestedCategory + " directory...")

  let browsingHeader = document.createElement('h2');
  browsingHeader.classList.add("browsingHeader");
  browsingHeader.textContent = requestedCategory + " projects";
  mainDisplayElem.appendChild(browsingHeader);


  var translatedCategory = "";
  if (requestedCategory == "thesis") {
    translatedCategory = pThesisValue;
  }

  for (var i = 0; i < projectCollection["projects"].length; i++) {
    console.log("pYearKey = " + projectCollection["projects"][i][pYearKey] + " --- translatedCategory = " + translatedCategory);
    if (projectCollection["projects"][i][pYearKey] === translatedCategory) {
      let newProjectLinkElement = produceProjectDirectoryLink(projectCollection["projects"][i]);
      mainDisplayElem.appendChild(newProjectLinkElement)
    }
  }
}


function produceDirectoryOfTag(requestedTag) {

  /* Creates a project list from the corresponding JSON collection
     and adds those new elements to the page. */

  console.log("Producing " + requestedTag + " directory...")

  let browsingHeader = document.createElement('h2');
  browsingHeader.classList.add("browsingHeader");
  browsingHeader.textContent = "Browsing: " + requestedTag;
  mainDisplayElem.appendChild(browsingHeader);

  /* Loop through every project and see if it has a matching Tag */
  for (var i = 0; i < projectCollection["projects"].length; i++) {
    let splitTags = projectCollection["projects"][i][pHashtagsKey].split(", ");
    let splitKeywords = projectCollection["projects"][i][pKeywordsKey].split(", ");

    var tagMatch = false;
    for (var t = 0; t < splitTags.length; t++) {
      var cleanedTag = splitTags[t].replace("#", "");
      if (requestedTag == cleanedTag) {tagMatch = true;}
    }

    var keywordMatch = false;
    for (var t = 0; t < splitKeywords.length; t++) {
      var cleanedKeyword = splitKeywords[t].replace("#", "");
      console.log("Checking keyword: " + cleanedKeyword);
      if (requestedTag == cleanedKeyword) {keywordMatch = true;}
    }


    if (tagMatch || keywordMatch) {
      let newProjectLinkElement = produceProjectDirectoryLink(projectCollection["projects"][i]);
      mainDisplayElem.appendChild(newProjectLinkElement)
    }

    // var tagMatch = false;





    // if (projectCollection["projects"][i][pYearKey] === translatedCategory) {
    //   let newProjectLinkElement = produceProjectDirectoryLink(projectCollection["projects"][i]);
    //   mainDisplayElem.appendChild(newProjectLinkElement)
    // }
  }
}

function produceProjectItemPage() {

  if (debugLogs) {
    console.log("Producing item page...")
  };

  /* Loop through collection to find matching project item */
  for (var i = 0; i < projectCollection["projects"].length; i++) {
    if (projectCollection["projects"][i][pIDKey] == paramProjectID) {
      let newProjectItemElement = produceItemContent(projectCollection["projects"][i]);

      /* Create all item content and append to page */
      mainDisplayElem.appendChild(newProjectItemElement);

      /* Enable lightbox for newly generated elements */
      const lightbox = GLightbox({
        touchNavigation: true,
        // openEffect: "fade",
        // closeEffect: "fade",
        loop: true,
      });

      break;
    }
  }

  // location.hash = "#mainAnchor"
}

function produceProjectDirectoryLink(projectJSON) {

  /* Returns an element link for the given incoming `projectJSON` */

  if (debugLogs) {
    // console.log("Producing link for following project JSON:");
  }

  let linkElement = document.createElement('a');
  linkElement.classList.add("projectPreviewLink");
  linkElement.href = "?cat=item&id=" + projectJSON[pIDKey];

  let articleElement = document.createElement('article');
  articleElement.classList.add("projectPreview");

  let projectThumbElement = document.createElement('img');
  projectThumbElement.src = "projects/" + projectJSON[pIDKey] + "/main.jpg";

  let projectInfoContainer = document.createElement('div');

  let studentNameElement = document.createElement('p');
  studentNameElement.textContent = projectJSON[sNameKey];
  let projectTitleElement = document.createElement('p');
  projectTitleElement.textContent = "\"" + projectJSON[pTitleKey] + "\"";
  let projectShortDescElement = document.createElement('p');
  projectShortDescElement.classList.add("shortDescription")
  projectShortDescElement.textContent = projectJSON[pShortDescKey];


  // linkElement.textContent = projectJSON[sNameKey] + " – " + projectJSON[pTitleKey];

  // studentNameElement.appendChild(linkElement);

  // projectInfoContainer.appendChild(linkElement);

  projectInfoContainer.appendChild(studentNameElement);
  projectInfoContainer.appendChild(projectTitleElement);
  projectInfoContainer.appendChild(projectShortDescElement);

  articleElement.appendChild(projectThumbElement);
  articleElement.appendChild(projectInfoContainer);

  linkElement.appendChild(articleElement);

  return linkElement;

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
  let projectTagCollectionElem = document.createElement('section');
  projectTagCollectionElem.classList.add("projectTags");
  let projectVideoEmbedElem = document.createElement('section');
  let projectAdditionalMediaElem = document.createElement('section');
  projectAdditionalMediaElem.classList.add("additionalMediaCollection");

  /* Student Name */
  projectStudentElem.textContent = projectJSON[sNameKey];
  projectElem.appendChild(projectStudentElem);

  /* Project Title */
  projectTitleElem.textContent = projectJSON[pTitleKey];
  projectElem.appendChild(projectTitleElem);

  /* Project Main Image */
  projectMainImageElem.src = "projects/" + projectJSON[pIDKey] + "/main.jpg"; /* OUTPUT: `/projectmedia/95/main.jpg` */
  projectMainImageElem.classList.add("projectMainImage");
  // projectMainImageElem.classList.add('glightbox'); /* For Lightbox functionality */
  /* PLACEHOLDER */
  // projectMainImageElem.src = "https://picsum.photos/1280/720";
  projectElem.appendChild(projectMainImageElem);

  /* Project External URL */
  if (projectJSON[pMainURLKey] != "" && projectJSON[pMainURLKey] != null) {
    projectExternalLinkElem.href = projectJSON[pMainURLKey];
    projectExternalLinkElem.setAttribute('target', '_blank');
    projectExternalLinkElem.textContent = "Visit Project Link";
    projectElem.appendChild(projectExternalLinkElem);
  }

  /* Project Description */
  let newParagraph = document.createElement('p');
  newParagraph.textContent = projectJSON[pLongDescKey];
  projectDescriptionElem.appendChild(newParagraph);
  projectElem.appendChild(projectDescriptionElem);

  /* Project Hashtags and Keywords */
  var hasTags = false;

  if (projectJSON[pHashtagsKey]!= "" && projectJSON[pHashtagsKey] != null) {
    console.log("Adding tags... #####");
    hasTags = true;
    let splitTags = projectJSON[pHashtagsKey].split(", ");
    for (var i = 0; i < splitTags.length; i++) {
      var newTagElem = document.createElement('a');
      var cleanedTag = splitTags[i].replace("#", "");
      newTagElem.href = "index.html?cat=tag&val=" + cleanedTag;
      newTagElem.textContent = "#" + cleanedTag;
      console.log("Cleaned tag = " + cleanedTag);
      projectTagCollectionElem.appendChild(newTagElem);
    }
  }

  if (projectJSON[pKeywordsKey]!= "" && projectJSON[pKeywordsKey] != null) {
    console.log("Adding tags... #####");
    hasTags = true;
    let splitTags = projectJSON[pKeywordsKey].split(", ");
    for (var i = 0; i < splitTags.length; i++) {
      var newTagElem = document.createElement('a');
      var cleanedTag = splitTags[i].replace("#", "");
      newTagElem.href = "index.html?cat=tag&val=" + cleanedTag;
      newTagElem.textContent = cleanedTag;
      console.log("Cleaned tag = " + cleanedTag);
      projectTagCollectionElem.appendChild(newTagElem);
    }

  }

  if (hasTags) {
    let tagSectionHeadlineElem = document.createElement('h3');
    tagSectionHeadlineElem.classList.add("sectionHeader");
    tagSectionHeadlineElem.textContent = "Tags & Themes";
    projectElem.appendChild(tagSectionHeadlineElem);
    projectElem.appendChild(projectTagCollectionElem);
  }

  /* Project Additional Media */
  if (projectJSON[pAdditionalMediaKey].length > 0) {

    let parsedAdditionalMediaFiles = projectJSON[pAdditionalMediaKey].split(", ");

    for (var i = 0; i < parsedAdditionalMediaFiles.length; i++) {
      /* Create Link */
      let newMediaLink = document.createElement('a');
      newMediaLink.classList.add('glightbox'); /* For Lightbox functionality */
      newMediaLink.href = "projects/" + projectJSON[pIDKey] + "/" + parsedAdditionalMediaFiles[i]; /* OUTPUT: `/projectmedia/95/my_photo.jpg` */
      newMediaLink.target = "_blank";
      /* Create thumbnail and add inside of link */
      let newMediaThumbnailImg = document.createElement('img');
      newMediaThumbnailImg.src = newMediaLink.href;
      /* PLACEHOLDER */
      // newMediaThumbnailImg.src = "https://picsum.photos/" + (1000 + (Math.floor(Math.random() * 1000))) + "/" + (500 + (Math.floor(Math.random() * 1000)));
      newMediaLink.appendChild(newMediaThumbnailImg);
      /* Add to additional media section */
      projectAdditionalMediaElem.appendChild(newMediaLink);
    }
    projectElem.appendChild(projectAdditionalMediaElem);
  }

  /* Project External Links */
  var hasExternalLinks = true;
  let externalLinkCollection = document.createElement('section');
  externalLinkCollection.classList.add("externalLinkCollection");

  if (projectJSON[sPersonalURLKey] != "" && projectJSON[sPersonalURLKey] != null) {
    hasExternalLinks = true;
    let projectPersonalLink = document.createElement('a');
    projectPersonalLink.href = projectJSON[sPersonalURLKey];
    projectPersonalLink.target = "_blank";
    projectPersonalLink.textContent = "Personal Site";
    externalLinkCollection.appendChild(projectPersonalLink);
  }
  if (projectJSON[sLinkedinKey] != "" && projectJSON[sLinkedinKey] != null) {
    hasExternalLinks = true;
    let linkedinLink = document.createElement('a');
    linkedinLink.href = projectJSON[sPersonalURLKey];
    linkedinLink.target = "_blank";
    linkedinLink.textContent = "Linkedin";
    externalLinkCollection.appendChild(linkedinLink);
  }
  if (projectJSON[sInstagramKey] != "" && projectJSON[sInstagramKey] != null) {
    hasExternalLinks = true;
    let instagramLink = document.createElement('a');
    instagramLink.href = "https://www.instagram.com/" + projectJSON[sInstagramKey] + "/";
    instagramLink.target = "_blank";
    instagramLink.textContent = "Instagram";
    externalLinkCollection.appendChild(instagramLink);
  }
  if (projectJSON[sYoutubeKey] != "" && projectJSON[sYoutubeKey] != null) {
    hasExternalLinks = true;
    let youtubeLink = document.createElement('a');
    youtubeLink.href = projectJSON[sYoutubeKey];
    youtubeLink.target = "_blank";
    youtubeLink.textContent = "YouTube";
    externalLinkCollection.appendChild(youtubeLink);
  }
  if (projectJSON[sTwitterKey] != "" && projectJSON[sTwitterKey] != null) {
    hasExternalLinks = true;
    let twitterLink = document.createElement('a');
    twitterLink.href = "https://twitter.com/" + projectJSON[sTwitterKey] + "/";
    twitterLink.target = "_blank";
    twitterLink.textContent = "Twitter";
    externalLinkCollection.appendChild(twitterLink);
  }

  if (hasExternalLinks) {
    projectElem.appendChild(externalLinkCollection);
  }

  return projectElem;

}

function getRandomMainImageURL() {
  let randomProjectIndex = Math.floor(Math.random() * projectCollection["projects"].length);
  let randomImageString = "projects/" + projectCollection["projects"][randomProjectIndex][pIDKey] + "/main.jpg";
  return randomImageString;
}
