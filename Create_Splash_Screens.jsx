#target photoshop

/* Ultimate phone tablet spash screens exporter Script by Benoit Freslon
 *  based on work of Hannes Delbeke 22/05/2013
 *  based on work of Tomek Cejner (tomek (at) japko dot info) (support of nested layer groups,  and exports single layers in addition to groups)
 *  based on work of Damien van Holten: http://www.damienvanholten.com/blog/export-groups-to-files-photoshop/
 */

// https://developer.apple.com/ios/human-interface-guidelines/icons-and-images/launch-screen/
// https://github.com/excellenteasy/ios-splash

var outFolder;

function main(){

    app.preferences.rulerUnits = Units.PIXELS ; 
    app.preferences.typeUnits = TypeUnits.PIXELS ;   
    
    if(!documents.length) return;
    var doc = activeDocument;
    var oldPath = activeDocument.path;
     
    outFolder = createFolder( oldPath + "/Splash_Screens/");

    //doc.activeLayer = layer;
    
    // iPhone Xs Max & iPhone Xr

    createScreenshot( "iOS", "iPhone Xs Max Portrait iOS 12+", 1242, 2688, 0);
    createScreenshot( "iOS", "iPhone Xr Max Portrait iOS 12+", 828, 1792, 0);

    createScreenshot( "iOS", "iPhone Xs Max Landscape iOS 12+", 2688, 1242, 0);
    createScreenshot( "iOS", "iPhone Xr Max Landscape iOS 12+", 1792, 828, 0);

    // iPHone X / iPHone Xs

    createScreenshot( "iOS", "iPhone X + iPhone Xs Portrait iOS 11+", 1125, 2436, 0);
    createScreenshot( "iOS", "iPhone X + iPhone Xs Landscape iOS 11+", 2436, 1125, 0);
    
    /////

    /*
    createScreenshot( "iOS", "iPad Portrait Without Status Bar iOS 5,6 1x", 768, 1004, 0);
    createScreenshot( "iOS", "iPad Portrait Without Status Bar iOS 5,6 2x", 1536, 2008, 0);    
    

    
    createScreenshot( "iOS", "iPad Landscape Without Status Bar iOS 5,6 1x", 1024, 748, 0);
    createScreenshot( "iOS", "iPad Landscape Without Status Bar iOS 5,6 2x", 2048, 1496, 0);    
    
     
    */

    // iPhone Reina HD 5.5" & Retina HD 4.7'

    createScreenshot( "iOS", "iPhone Portrait Retina HD 5.5\" iOS 8+", 1242, 2208, 0);
    createScreenshot( "iOS", "iPhone Portrait Retina HD 4.7\" iOS 8+", 750, 1334, 0);
    
    createScreenshot( "iOS", "iPhone Landscape Retina HD 5.5\" iOS 8+", 2208, 1242, 0);

    // iPhone 2x & Retina 4

    createScreenshot( "iOS", "iPhone Portrait 2x iOS 7+", 640, 960, 0);
    createScreenshot( "iOS", "iPhone Portrait Retina4 iOS 7+", 640, 1136, 0);

    // iPad Portrait & iPad Landscape

    createScreenshot( "iOS", "iPad Portrait 1x 7+", 768, 1024, 0);
    createScreenshot( "iOS", "iPad Portrait 2x 7+", 1536, 2048, 0);    

    createScreenshot( "iOS", "iPad Landscape 1x iOS 7+", 1024, 768, 0);
    createScreenshot( "iOS", "iPad Landscape 2x iOS 7+", 2048, 1536, 0);   

    // iPhone Portrait

    createScreenshot( "iOS", "iPhone Portrait 1x iOS 5,6", 320, 480, 0);
    createScreenshot( "iOS", "iPhone Portrait 2x iOS 5,6", 640, 960, 0);
    createScreenshot( "iOS", "iPhone Portrait Retina 4 iOS 5,6", 640, 1136, 0);

    // iPad Without Status Bar & iPad Portrait & iPad Landscae Without Status Bar & iPad Landscape

    
    createScreenshot( "iOS", "iPad Portrait Without Status Bar 1x iOS 5,6", 768, 1004, 0);
    createScreenshot( "iOS", "iPad Portrait Without Status Bar 2x iOS 5,6", 1536, 2008, 0);
    
    createScreenshot( "iOS", "iPad Portrait 1x iOS 5,6", 768, 1024, 0);
    createScreenshot( "iOS", "iPad Portrait 2x iOS 5,6", 1536, 2048, 0);
    
    createScreenshot( "iOS", "iPad Lanscape Without Status Bar 1x iOS 5,6", 1024, 748, 0);
    createScreenshot( "iOS", "iPad Lanscape Without Status Bar 2x iOS 5,6", 2048, 1496, 0);

    createScreenshot( "iOS", "iPad Landscape 1x iOS 5,6 1x", 1024, 768, 0);
    createScreenshot( "iOS", "iPad Landscape 2x iOS 5,6 2x", 2048, 1536, 0); 
    
    // Android
    
    createScreenshot( "Android", "LDPI_Portrait_200x320", 200, 320, 0);
    createScreenshot( "Android", "LDPI_Landscape_320x200", 320, 200, 0);
    
    createScreenshot( "Android", "MDPI_Portrait_320x480", 320, 480, 0);
    createScreenshot( "Android", "MDPI_Landscape_480x320", 480, 320, 0);
    
    createScreenshot( "Android", "HDPI_Portrait_480x800", 480, 800, 0);
    createScreenshot( "Android", "HDPI_Landscape_800x480", 800, 480, 0);
    
    createScreenshot( "Android", "XHDPI_Portrait_720x1280", 720, 1280, 0);
    createScreenshot( "Android", "XHDPI_Landscape_1280x720", 1280, 720, 0);
    
    createScreenshot( "Android", "XXHDPI_Portrait_960x1600", 960, 1600, 0);
    createScreenshot( "Android", "XXHDPI_Landscape_1600x960", 1600, 960, 0);
    
    createScreenshot( "Android", "XXXHDPI_Portrait_1280x1920", 1280, 1920, 0);
    createScreenshot( "Android", "XXXHDPI_Landscape_1920x1280", 1920, 1280, 0);
    
};
 
function createScreenshot(folderName, fileName, width, height, rotate) {
    trace("createScreenshot: "+folderName+ " "+fileName+ " "+width+ " " + " " + height);
    
    var savedState = app.activeDocument.activeHistoryState    
    
    //dupLayers();
    
    activeDocument.rotateCanvas(rotate);    
    
    //var w = setOrientationW(width, height);
    //var h = setOrientationH(width, height);
    resizeImageAndCanvas(width, height);
   
    //activeDocument.mergeVisibleLayers();
    
    createFolder(outFolder + "/" + folderName);
    var path = outFolder + "/" + folderName +"/"+ fileName+".png";
    trace(path);
    var saveFile = File(path);
    SavePNG(saveFile); 
    //app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
    app.activeDocument.activeHistoryState = savedState
}
 
function trace ( msg ) {
    $.writeln( msg );
}

function createFolder ( folderName ) {
    var folder = new Folder ( folderName );
    if ( !folder.exists ) 
    {
        folder.create ();
    }
    return folder;
}

function resizeImageAndCanvas(w, h) {
    if (h > w) {
        activeDocument.resizeImage( null , h );
    } else {
        activeDocument.resizeImage( w , null );
    }
    activeDocument.resizeCanvas( w , h , AnchorPosition.MIDDLECENTER);
}

function SavePNG(saveFile) {
    trace("SavePNG: "+saveFile);
    var pngOpts = new ExportOptionsSaveForWeb; 
    pngOpts.format = SaveDocumentType.PNG
    pngOpts.PNG8 = false; 
    pngOpts.transparency = false; 
    pngOpts.interlaced = false; 
    pngOpts.quality = 100;
    activeDocument.exportDocument(new File(saveFile),ExportType.SAVEFORWEB,pngOpts); 
}

main();