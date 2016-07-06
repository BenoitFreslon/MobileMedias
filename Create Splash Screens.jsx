#target photoshop
// Photoshop Script to Create Icons
//
// Prerequisite:
// First, create at least a 1024x1024 px PNG file according to:
// http://developer.apple.com/library/ios/#documentation/iphone/conceptual/iphoneosprogrammingguide/BuildTimeConfiguration/BuildTimeConfiguration.html
//
// Install - Save Create Icons.jsx to:
//   Win: C:\Program Files\Adobe\Adobe Utilities\ExtendScript Toolkit CS5\SDK
//   Mac: /Applications/Utilities/Adobe Utilities/ExtendScript Toolkit CS5/SDK
// * Restart Photoshop
//
// Update:
//
// Run:
// * With Photoshop open, select File > Scripts > Create Splash Screens
// * When prompted select the prepared splash screen file for your app.
//
// Adobe Photoshop JavaScript Reference
// http://www.adobe.com/devnet/photoshop/scripting.html

// Turn debugger on. 0 is off.
// $.level = 1;

try
{
  // Prompt user to select iTunesArtwork file. Clicking "Cancel" returns null.
  var iTunesArtwork = File.openDialog("Select a splash screen .PNG file that is a square image at 2208x2208.", "*.png", false);

  if (iTunesArtwork !== null) 
  { 
    var doc = open(iTunesArtwork, OpenDocumentType.PNG);
    
    if (doc == null)
    {
      throw "Something is wrong with the file.  Make sure it's a valid PNG file.";
    }

    var startState = doc.activeHistoryState;       // save for undo
    var initialPrefs = app.preferences.rulerUnits; // will restore at end
    app.preferences.rulerUnits = Units.PIXELS;     // use pixels

    if (doc.width != doc.height)
    {
        throw "Image is not square";
    }
    else if ((doc.width < 2208) && (doc.height < 2208))
    {
        throw "Image is too small!  Image must be at least 2208x2208 pixels.";
    }
    else if (doc.width < 2208)
    {
        throw "Image width is too small!  Image width must be at least 2208 pixels.";
    }
    else if (doc.height < 2208)
    {
        throw "Image height is too small!  Image height must be at least 2208 pixels.";
    }
    
    // Folder selection dialog
    var destFolder = Folder.selectDialog( "Choose an output folder");

    var outFolderIPad= new Folder(destFolder + "/SplashScreens-iOS");
    if (!outFolderIPad.exists) 
    {
        outFolderIPad.create();
    }
    var outFolderIPad= new Folder(destFolder + "/SplashScreens-Android");
    if (!outFolderIPad.exists) 
    {
        outFolderIPad.create();
    }

    if (destFolder == null)
    {
      // User canceled, just exit
      throw "";
    }

    // Save icons in PNG using Save for Web.
    var sfw = new ExportOptionsSaveForWeb();
    sfw.format = SaveDocumentType.PNG;
    sfw.PNG8 = true; // use PNG-24
    sfw.transparency = false;
    doc.info = null;  // delete metadata
    
    // iOS
    var icons = [
      {"name": "Default~iphone", 		                "w":320, "h":480, "size":25, rotate:0},
      {"name": "Default@2x~iphone",    		         "w":640, "h":960, "size":50, rotate:0},
      {"name": "Default-568h@2x~iphone",    		"w":640, "h":1136, "size":60, rotate:0},
      {"name": "Default-375w-667h@2x~iphone",    		"w":750, "h":1334, "size":70, rotate:0},
      {"name": "Default-414w-736h@3x~iphone",    		"w":1242, "h":2208, "size":100, rotate:0},
      {"name": "Default-Landscape-414w-736h@3x~iphone",    		"w":1242, "h":2208, "size":100, rotate:0},
      
      {"name": "Default-Portrait~ipad",          	    "w":768, "h":1024, "size":50, rotate:0},
      {"name": "Default-PortraitUpsideDown~ipad",           	"w":768, "h":1024, "size":50, rotate:0}, 
      
      {"name": "Default-Landscape~ipad",           	"w":1024, "h":768, "size":50, rotate:0}, 
      {"name": "Default-LandscapeRight~ipad",           	"w":1024, "h":768, "size":50, rotate:180}, 
      
      {"name": "Default-Portrait@2x~ipad",           	"w":1536, "h":2048, "size":100, rotate:0}, 
      {"name": "Default-PortraitUpsideDown@2x~ipad",           	"w":1536, "h":2048, "size":100, rotate:180}, 
      
      {"name": "Default-LandscapeLeft@2x~ipad",           	"w":2048, "h":1536, "size":100, rotate:0}, 
      {"name": "Default-LandscapeRight@2x~ipad",           	"w":2048, "h":1536, "size":100, rotate:180},
      
    ];

    var icon;
    for (i = 0; i < icons.length; i++) 
    {
      icon = icons[i];
      app.preferences.rulerUnits = Units.PERCENT;
      doc.resizeImage( icon.size, null, null, ResampleMethod.BICUBICSHARPER);
      app.preferences.rulerUnits = Units.PIXELS;
      doc.resizeCanvas( icon.w , icon.h, AnchorPosition.MIDDLECENTER);
    
        if (icon.rotate != 0) {
            doc.rotateCanvas(icon.rotate);
        }


      var destFileName = icon.name + ".png";
       
      doc.exportDocument(new File(destFolder + "/SplashScreens-iOS/" + destFileName), ExportType.SAVEFORWEB, sfw);
      doc.activeHistoryState = startState; // undo resize
    }

    // Android
    // TO DO
    var icons = [
    ];

    var icon;
    for (i = 0; i < icons.length; i++) 
    {
      icon = icons[i];
      app.preferences.rulerUnits = Units.PERCENT;
      doc.resizeImage( icon.size, null, null, ResampleMethod.BICUBICSHARPER);
      app.preferences.rulerUnits = Units.PIXELS;
      doc.resizeCanvas( icon.w , icon.h, AnchorPosition.MIDDLECENTER);

      var destFileName = icon.name + ".png";
      
      doc.exportDocument(new File(destFolder + "/SplashScreens-Android/" + destFileName), ExportType.SAVEFORWEB, sfw);
      doc.activeHistoryState = startState; // undo resize
    }

    alert("Splash Screens created!");
  }
}
catch (exception)
{
  // Show degbug message and then quit
	if ((exception != null) && (exception != ""))
    alert(exception);
 }
finally
{
    if (doc != null)
        doc.close(SaveOptions.DONOTSAVECHANGES);
  
    app.preferences.rulerUnits = initialPrefs; // restore prefs
}