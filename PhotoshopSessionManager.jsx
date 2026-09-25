#target photoshop

// License: MIT
// senol41tr (https://ssarigul.tr)
// TESTED: CS 5.1 for Windows

/*
@@@BUILDINFO@@@ PhotoshopSessionManager.jsx 0.1
*/

var begDesc = "Open tabs from the previous session" // endDesc
var begName = "Photoshop Session Manager (for Windows)" // endName
var sessionFilePath = Folder.userData + "/photoshop_session_manager.files";

function saveCurrentSession()
{
    try
    {
        var sessionFile = new File(sessionFilePath);
        sessionFile.encoding = "UTF8";
        sessionFile.open("w");
        
        for (var i = 0; i < app.documents.length; i++) {
            try {
                var docPath = app.documents[i].fullName.fsName;
                sessionFile.writeln(docPath);
            } catch (e) {
            }
        }
        sessionFile.close();
    } catch (err) {
        alert("SessionManager Save Error: " + err.message);
    }
}

function restoreSession() {
    try {
        var sessionFile = new File(sessionFilePath);
        sessionFile.encoding = "UTF8";

        if (!sessionFile.exists)
        {
            alert(sessionFilePath + ' not found!');
            return;
        }
        
        sessionFile.open("r");
        while (!sessionFile.eof)
        {
            var filePath = sessionFile.readln();
            if (filePath === "") continue;
            
            var fileToOpen = new File(filePath);
            if (fileToOpen.exists)
            {
                try
                {
                    app.open(fileToOpen);
                }
                catch(e)
                {
                    alert("Failed to open document: " + filePath + "\nDetails: " + e.message);
                }
            }
        }
        sessionFile.close();
    } catch (err) {
        alert("SessionManager Restore Error: " + err.message);
    }
}


var sessionFile = new File(sessionFilePath);
sessionFile.encoding = "UTF8";

if (!sessionFile.exists)
{
    // create .txt file
    sessionFile.open("w");
    sessionFile.close();

    // add notifiers
    try
    {
        var scriptFileObj = new File($.fileName);
        if (scriptFileObj.exists)
        {
            // TODO check notifiers added
            // app.notifiers.removeAll();
            if(!app.notifiersEnabled) app.notifiersEnabled = true;
            app.preferences.eventsReceipt = true;
            app.notifiers.add('Ntfy', scriptFileObj); // Application Start
            app.notifiers.add('Opn ', scriptFileObj); // Document Open
            app.notifiers.add('Cls ', scriptFileObj); // Document Close
            app.notifiers.add('save', scriptFileObj); // Document Save
            alert("Photoshop Session Manager Installation Successfully!");
        }
    }
    catch (err)
    {
        alert('Notifier Error: ' + err.message);
    }
}
else
{
    var activeEvent = app.typeIDToStringID(arguments[1]);
    
    if (activeEvent === 'notify')
    {
        restoreSession();
    }
    else
    {
        saveCurrentSession();
    }
}