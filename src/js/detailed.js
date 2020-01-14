const projectTitle = GLOBAL_FRONT_END_CONFIG.PROJECT_TITLE;
const projectBrand = GLOBAL_FRONT_END_CONFIG.PROJECT_BRAND;

window.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById("project-title").innerHTML = projectTitle;
    document.getElementById("project-brand").innerHTML = projectBrand;

    const backendUrl = BACKEND_URL;
    
    var recvizLocalStorage = new RecvizLocalStorage();

    const INFO_BOX_ID = "#body-page-infobox";
    var utilityLib = new UtilitiesLibrary(INFO_BOX_ID);
    var backendApi = new BackendApi(backendUrl);

    const isTokenExists = recvizLocalStorage.isAuthTokenExists();
    if(isTokenExists) {
        const authToken = recvizLocalStorage.getAuthToken();        
        const queryParams = utilityLib.getAllUrlParams();

        if(queryParams && queryParams.folderid && queryParams.fileid && queryParams.sourcedoc && queryParams.targetdoc) {
            const folderId = queryParams.folderid;
            const fileId = queryParams.fileid;
            const sourcedoc = queryParams.sourcedoc;
            const targetdoc = queryParams.targetdoc;

            const foldername = queryParams.foldername;
            const filename = queryParams.filename;

            if(foldername && filename) {
                const folderUrl = "/folder.html?folderId="+folderId;
                document.getElementById("breadcrumb-folder-name").innerHTML = '<a href="'+folderUrl+'">'+foldername+"</a>";
                const overviewUrl = "/overview.html?folderId="+folderId+"&fileId="+fileId+"&folderName="+foldername+"&fileName="+filename;
                document.getElementById("breadcrumb-file-name").innerHTML = '<a href="'+overviewUrl+'">'+filename+"</a>";
           }

           //The "backendApi" calls are for demonstrating the data fetching from backend that you could possibly use for your visualization.
           //backendApi provides callback based API, if you are not familiar with callbacks please do a reading on that. These calls are not going to work sequentially thus do not get surprised about it.
           //If callback based API becomes a pain, I may switch to promise based API if that would help.

           backendApi.detailedViewCompare(authToken, sourcedoc, targetdoc, function(err, comparisonData){
                if(!err) {
                    console.log("Sourcedoc "+sourcedoc+" and Targetdoc "+targetdoc+" Comparison Data: ");
                    console.log(comparisonData);
                } else {
                    if(err == "token expired") {
                        recvizLocalStorage.clearToken();
                        window.location.replace("/login.html");
                    } else {
                        utilityLib.informUser("alert-danger", err);
                    }
                }
            })

            backendApi.fetchDocumentFullData(authToken, sourcedoc, function(err, fullDocData){
                if(!err) {
                    console.log("SOURCE DOC DOCUMENT FULL DATA:");
                    console.log(fullDocData);
                } else {
                    if(err == "token expired") {
                        recvizLocalStorage.clearToken();
                        window.location.replace("/login.html");
                    } else {
                        utilityLib.informUser("alert-danger", err);
                    }
                }
            })

            backendApi.fetchDocumentFullData(authToken, targetdoc, function(err, fullDocData){
                if(!err) {
                    console.log("TARGET DOC DOCUMENT FULL DATA:");
                    console.log(fullDocData);
                } else {
                    if(err == "token expired") {
                        recvizLocalStorage.clearToken();
                        window.location.replace("/login.html");
                    } else {
                        utilityLib.informUser("alert-danger", err);
                    }
                }
            })

            backendApi.fetchDocumentMetadata(authToken, sourcedoc, function(err, metadata){
                if(!err) {
                    console.log("SOURCE DOC METADATA:");
                    console.log(metadata);
                } else {
                    if(err == "token expired") {
                        recvizLocalStorage.clearToken();
                        window.location.replace("/login.html");
                    } else {
                        utilityLib.informUser("alert-danger", err);
                    }
                }
            })

            backendApi.fetchDocumentMetadata(authToken, targetdoc, function(err, metadata){
                if(!err) {
                    console.log("TARGET DOC METADATA:");
                    console.log(metadata);
                } else {
                    if(err == "token expired") {
                        recvizLocalStorage.clearToken();
                        window.location.replace("/login.html");
                    } else {
                        utilityLib.informUser("alert-danger", err);
                    }
                }
            })

            var controllerDiv = document.getElementById("detailed-view-controller"); //This will serve necessary controls for enabling/disabling individiual similarity components such as text, citation and image. For example, I should be able to just see text plagiarism detection or text + citation or text + citation + image or nothing at all. This DIV is giving me ability to select what I want to see.
            var baseVisualizationDiv = document.getElementById("detailed-view-base-vis"); //This is where your visualization go.


        } else {
            utilityLib.informUser("alert-danger", "Invalid query parameters. Please enter a valid URL.");
        }
    } else {
        utilityLib.informUser("alert-danger", "Authorization needed. Please login.");
        window.location.replace("/login.html");
    }
});

/* Project Notes
    - Shadow effect on baseoverlays create performance issues when all nodes are in sight and there are about 15 nodes yet this effect makes it much more visually appealing.
*/