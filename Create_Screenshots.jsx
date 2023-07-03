#target photoshop

/* Ultimate phone tablet screenshots exporter Script by Benoit Freslon
 *  based on work of Hannes Delbeke 22/05/2013
 *  based on work of Tomek Cejner (tomek (at) japko dot info) (support of nested layer groups,  and exports single layers in addition to groups)
 *  based on work of Damien van Holten: http://www.damienvanholten.com/blog/export-groups-to-files-photoshop/
 */

var doc;
var oldPath;
var outFolder;
var jpg = false;
var jpegQuality             = 80;

var allLanguages            = [];
var allScreenshots          = [];

var normalCanvasSize = { width:2048, height:2732 };

var allDevices              = [
    {name:"6.7 iPhone 14 Pro Max",      width:1290, height:2796, useNormalCanvas:false},
    {name:"6.5 iPhone 14 Plus",         width:1284, height:2778, useNormalCanvas:false},
    {name:"6.1 iPhone 14 Pro",          width:1179, height:2556, useNormalCanvas:false},
    {name:"5.8 iPhone 14",              width:1170, height:2532, useNormalCanvas:false},
    {name:"5.5 iPhone 8",               width:1242, height:2208, useNormalCanvas:true},
    {name:"4.7 iPhone SE (2nd gen.)",   width:750, height:1334, useNormalCanvas:true},
    {name:"4 iPhone SE (1st gen.)",     width:640, height:1136, useNormalCanvas:true},  
    
    {name:"12.9 iPad Pro (6th gen.)",  width:2048, height:2732, useNormalCanvas:true},
    {name:"12.9 iPad Pro (2nd gen.)",  width:2048, height:2732, useNormalCanvas:true},
    {name:"11 iPad Pro",                width:1668, height:2388, useNormalCanvas:true},
    {name:"10.5 iPad Air",            width:1668, height:2224, useNormalCanvas:true},
    {name:"9.7 iPad",                 width:1536, height:2048, useNormalCanvas:true},
    
    {name:"Android Tablet 7",         width:1200, height:1920, useNormalCanvas:true},
    {name:"Android Tablet 10",        width:1600, height:2560, useNormalCanvas:true}
];

var selectedLanguages       = [];
var selectedScreenshots     = [];
var selectedDevices         = [];

function main() {

    trace ("Screenshot generator started");

    scanLayers();

    showConfigurationAlertBox();

};

function generateScreenshots() {
    
    app.preferences.rulerUnits = Units.PIXELS ; 
    app.preferences.typeUnits = TypeUnits.PIXELS ;   


    if(!documents.length) return;
    
    //trace ("app "+app);
    //trace ("app.activeDocument "+app.activeDocument);
    //trace ("app.activeDocument "+app.activeDocument.path);
    
    doc = app.activeDocument;
    oldPath = app.activeDocument.path;
    outFolder = createFolder( oldPath + "/Screenshots");
    
    scanLayerSets(app.activeDocument);
}


function scanLayerSets(el) {
    
    // find layer groups
    for(var a = 0; a < el.layerSets.length; a++)
    {
        var groupScreen = el.layerSets[a] ;
        groupname = groupScreen.name; //check name for every layer
        trace ("groupname: "+groupScreen.name+" "+arrayIndexOf(selectedScreenshots, groupname));
        trace(selectedScreenshots)
        if (arrayIndexOf(selectedScreenshots, groupname) != -1 && (groupname.substr(-4) == ".png" || groupname.substr(-4) == ".jpg"))  //if name ends in jpg or png
        {
            trace ("groupname found: "+groupScreen.name)
            //find txt group
            for(var b=0; b< groupScreen.layerSets.length; b++) //layersets are groups
            {
                var txtgroup = groupScreen.layerSets[b] ;
                var txtname = txtgroup.name;
                if (txtname == "txt")  //if name is txt
                {
                    var languageLayer;

                    for(var c=0; c < txtgroup.artLayers.length; c++) //check all layers in the txt file
                    {
                        languageLayer = txtgroup.artLayers[c] ;
                        languageLayer.visible = false;
                    }
                    for( var d=0;d<txtgroup.artLayers.length;d++) //check all layers in the txt file
                    {
                        languageLayer = txtgroup.artLayers[d] ;
                        languageLayer.visible = true; //put  1 txt layer on visible
                        if (arrayIndexOf(selectedLanguages, languageLayer.name) != -1)
                            saveLayer(groupScreen, languageLayer, oldPath); //save the file
                        languageLayer.visible = false; //put it back invisible for next layer
                    }
                }
            }
        }
        
    }
    alert("Screenshots created!");
}
 
function saveLayer(layer, lname, path) {
    trace("saveLayer: "+layer+" "+path);
    
    layer.visible = true;
    app.activeDocument.activeLayer = layer;
    
    for( var i = 0; i< selectedDevices.length; i++) {
        trace("selectedDevices[i] " + selectedDevices[i]);
        createScreenshot(layer, lname, selectedDevices[i].name, selectedDevices[i].height, selectedDevices[i].width, selectedDevices[i].useNormalCanvas);
    }
}

function createScreenshot(layer, lname, namedevice, width, height, useNormalCanvas) {
    
    trace("createScreenshot: "+layer+" "+lname+" "+namedevice+" "+width+" "+height);
    
    createFolder(namedevice);
    dupLayers();
    
    app.activeDocument.mergeVisibleLayers();
    var w = setOrientationW(width, height);
    var h = setOrientationH(width, height);
    
    if (useNormalCanvas) {
        if (activeDocument.height > activeDocument.width) {
            // Portrait
            app.activeDocument.resizeCanvas( normalCanvasSize.width, normalCanvasSize.height , AnchorPosition.MIDDLECENTER);
        } else {
            // Landscape
            app.activeDocument.resizeCanvas( normalCanvasSize.height, normalCanvasSize.width , AnchorPosition.MIDDLECENTER);
        }
    }
    
    resizeImageAndCanvas(w, h);
    var screenName = layer.name;
    screenName = screenName.substring(0,screenName.length-4 );
    var exportName = "/" + lname.name + "_"+ screenName + "_"+ namedevice + "_"+  w  + "x"+ h;
    if (jpg) {
        exportName += ".jpg";   
    } else {
        exportName += ".png";
    }
        
    //app.activeDocument.mergeVisibleLayers();
    //activeDocument.trim(TrimType.TRANSPARENT,true,true,true,true);
    var folder = createFolder ( outFolder +"/"+ lname.name + "/" + namedevice+"_" + w  + "x"+ h);
    var saveFile = File(folder + exportName);
    if (jpg) {
        SaveJPG(saveFile, jpegQuality);
    } else {
        SavePNG(saveFile);
    }
    
    app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
}

function scanLayers() {

    var doc = activeDocument;
    
    // find layer groups
    for(var a = 0; a < app.activeDocument.layerSets.length; a++)
    {
        var groupScreen = app.activeDocument.layerSets[a] ;
        groupname = groupScreen.name; //check name for every layer
        
        if (groupname.substr(-4) == ".png" || groupname.substr(-4) == ".jpg")  //if name ends in jpg or png
        {
            //trace ("add groupname: "+groupname);
            allScreenshots.push(groupname);
            trace("Layer found: "+groupname);   
            //find txt group
            for(var b = 0; b < groupScreen.layerSets.length; b++) //layersets are groups
            {
                var txtgroup = groupScreen.layerSets[b] ;
                var txtname = txtgroup.name;
                if (txtname == "txt")  //if name is txt
                {
                    var languageLayer;

                    for(var c = 0; c < txtgroup.artLayers.length; c++) //check all layers in the txt file
                    {
                        languageLayer = txtgroup.artLayers[c].name;
                        if (arrayIndexOf( allLanguages, languageLayer) == -1)
                            allLanguages.push(languageLayer);
                    }
                }
            }
        }
        if ( groupname.split( "permanent" ).length > 1 ) {
            groupScreen.visible = true;
        }
    }
    //trace ("Scan layers "+ allLanguages+ " " + allLanguages.length);
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

    trace ("resizeImageAndCanvas: "+w+" "+h+" "+app+" "+app.activeDocument);

    if (app.activeDocument.height > app.activeDocument.width) {
         app.activeDocument.resizeImage( null , h);
    } else {
         app.activeDocument.resizeImage( w , null );
    }
    app.activeDocument.resizeCanvas( w , h , AnchorPosition.MIDDLECENTER);
}
 
function setOrientationW ( w, h ) {
    if (activeDocument.height > activeDocument.width) {
        return h;
    }
    return w;
}

function setOrientationH ( w, h ) {
    if (activeDocument.height > activeDocument.width) {
        return w;
    }
    return h;
}
 
function dupLayers() { 
    var desc143 = new ActionDescriptor();
    var ref73 = new ActionReference();
    ref73.putClass( charIDToTypeID('Dcmn') );
    desc143.putReference( charIDToTypeID('null'), ref73 );
    desc143.putString( charIDToTypeID('Nm  '), activeDocument.activeLayer.name );
    var ref74 = new ActionReference();
    ref74.putEnumerated( charIDToTypeID('Lyr '), charIDToTypeID('Ordn'), charIDToTypeID('Trgt') );
    desc143.putReference( charIDToTypeID('Usng'), ref74 );
    executeAction( charIDToTypeID('Mk  '), desc143, DialogModes.NO );
}

function SaveJPG( saveFile, jpegQuality ) {
    trace("SaveJPG: q: "+jpegQuality+" > "+saveFile);
    var sfwOptions = new ExportOptionsSaveForWeb(); 
    sfwOptions.format = SaveDocumentType.JPEG; 
    sfwOptions.includeProfile = false; 
    sfwOptions.interlaced = 0; 
    sfwOptions.optimized = true; 
    sfwOptions.quality = jpegQuality; //0-100 
    activeDocument.exportDocument(saveFile, ExportType.SAVEFORWEB, sfwOptions);
}

function SavePNG(saveFile) {
    trace("SavePNG: "+saveFile);
    var pngOpts = new ExportOptionsSaveForWeb; 
    pngOpts.format = SaveDocumentType.PNG
    pngOpts.PNG8 = false; 
    pngOpts.transparency = false; 
    pngOpts.interlaced = false; 
    pngOpts.quality = 100;
    app.activeDocument.exportDocument(saveFile, ExportType.SAVEFORWEB, pngOpts); 
}
 


// Dialog Box

function checkAll( arr ) {
    for (i = 0; i < arr.length; i++)
        arr[i].value = true;
}

function uncheckAll( arr ) {
    for (i = 0; i < arr.length; i++)
        arr[i].value = false;
}

function arrayIndexOf(arr, value) {

    for (i = 0; i < arr.length; i++)
        if (arr[i] == value)
            return i;
    return -1;
}

function showConfigurationAlertBox() {
    
    var box = new Window("dialog","Export configuration", undefined, { resizeable:true, su1PanelCoordinates:true, closeButton:true } );
    //box.alignChildren = ["top", "bottom", "fill"];
    //box.alignChildren = "stack";
    box.orientation = "row"
    box.alignment = "top"
    //box.dimension = [300, 800];
    //box.alignment = "row";
    box.size = [ 1000, 800 ]
    
    
    // Format
    box.panelFormat = box.add('panel', undefined, "Format");  
    box.panelFormat.alignChildren = ["top", "fill"];
    box.panelFormat.group = box.panelFormat.add('group', undefined );  
    box.panelFormat.group.orientation = 'row';  
    
    var radio2 = box.panelFormat.add ("radiobutton", undefined, "PNG Format");
    radio2.onClick = function () {
        //trace("radio2");
        slider.enabled = false;
        jpegQualityText.enabled = false;
        jpg = false;
    }
    var radio1 = box.panelFormat.add ("radiobutton", undefined, "JPG Format");
    radio1.onClick = function () {
        //trace("radio1");
        slider.enabled = true;
        jpegQualityText.enabled = true;
        jpg = true;
    }
        
    var jpegQualityText = box.panelFormat.add ("edittext", undefined, 80);
    var slider = box.panelFormat.add ("slider", undefined, 80, 0, 100);  
    
    radio2.value = true;
    slider.enabled = false;
    jpegQualityText.enabled = false;    
    
    // Jpeg quality

    slider.onChanging = function () {
        jpegQualityText.text = slider.value;
        jpegQuality = slider.value;
    }
    jpegQuality = slider.value;    
    
    // Devices
    
    box.panelDevices = box.add('panel', undefined, "Devices"); 
    box.panelDevices.alignChildren = ["left", "fill"];
    box.panelDevices.group = box.panelDevices.add('group', undefined );  
    box.panelDevices.group.orientation = 'row';
    
    var deviceCheckboxes = [];
    
    for (var i = 0; i < allDevices.length; i++) {
        var cb = box.panelDevices.add('checkbox', undefined, allDevices[i].name);
        cb.device = allDevices[i];
        deviceCheckboxes.push(cb);
    }
    checkAll(deviceCheckboxes);
    
    box.panelDevices.group.selectAllBtn = box.panelDevices.group.add('button', undefined, "All");  
    box.panelDevices.group.selectAllBtn.onClick = function() {  
        checkAll(deviceCheckboxes);
    }  
    box.panelDevices.group.unselectAllBtn = box.panelDevices.group.add('button', undefined, "None");  
    box.panelDevices.group.unselectAllBtn.onClick = function() { 
        uncheckAll(deviceCheckboxes);
    }  

    
    
    // Screenshots
    
    var screenshotCheckboxes = [];
    
    box.panelScreenshots = box.add('panel', undefined, "Select screenshots");
    box.panelScreenshots.alignChildren = ["left", "fill"];
    box.panelScreenshots.group = box.panelScreenshots.add('group', undefined );  
    box.panelScreenshots.group.orientation = 'row';   
    
    for (var i = 0; i < allScreenshots.length; i++) {
        var cb = box.panelScreenshots.add('checkbox', undefined, allScreenshots[i]);
        screenshotCheckboxes.push(cb);
    }
    checkAll(screenshotCheckboxes);
      
    //box.panel.group.text1 = box.panel.group.add('statictext', undefined, "Buttons");  
    
    box.panelScreenshots.group.selectAllBtn = box.panelScreenshots.group.add('button', undefined, "All");  
    box.panelScreenshots.group.selectAllBtn.onClick = function() {  
        checkAll(screenshotCheckboxes);
    }  
    box.panelScreenshots.group.unselectAllBtn = box.panelScreenshots.group.add('button', undefined, "None");  
    box.panelScreenshots.group.unselectAllBtn.onClick = function() { 
        uncheckAll(screenshotCheckboxes);
    }     
    
    // Languages
    
    var languageCheckboxes = [];
    
    box.panelLanguages = box.add('panel', undefined, "Select languages");  
    box.panelScreenshots.alignChildren = ["left", "fill"];
    box.panelLanguages.group = box.panelLanguages.add('group', undefined );  
    box.panelLanguages.group.orientation = 'row';
    box.panelLanguages.group.alignment = 'left'; 
    
    for (var i = 0; i < allLanguages.length; i++) {
        var cb = box.panelLanguages.add('checkbox', undefined, allLanguages[i]);
        languageCheckboxes.push(cb);
    }
    checkAll(languageCheckboxes);
    
    
    box.panelLanguages.group.selectAllBtn = box.panelLanguages.group.add('button', undefined, "All");  
    box.panelLanguages.group.selectAllBtn.onClick = function() {  
        checkAll(languageCheckboxes);
    }  
    box.panelLanguages.group.unselectAllBtn = box.panelLanguages.group.add('button', undefined, "None");  
    box.panelLanguages.group.unselectAllBtn.onClick = function() {  
        uncheckAll(languageCheckboxes);
    }     
  
    
    box.group = box.add('group', undefined );
    //box.group.orientation = "column";
    //box.group.alignment = "bottom";
    // Cancel button
    var btnClose = box.group.add ("button", undefined, "Close");
    btnClose.onClick = function () {
        box.close();
    }    
    
    // Ok button
    var btnOk = box.group.add ("button", undefined, "OK");
    btnOk.onClick = function () {
        // Devices
        for (var i = 0; i < deviceCheckboxes.length; i++) {
            if (deviceCheckboxes[i].value) {
                selectedDevices.push(deviceCheckboxes[i].device);
            }
        }
    
        // Screenshots
        for (var i = 0; i < screenshotCheckboxes.length; i++) {
            if (screenshotCheckboxes[i].value) {
                selectedScreenshots.push(screenshotCheckboxes[i].text);
            }
        }
        // Languages
        for (var i = 0; i < languageCheckboxes.length; i++) {
            if (languageCheckboxes[i].value) {
                selectedLanguages.push(languageCheckboxes[i].text);
            }
        }
    
    
        //trace ("selectedDevices: "+ selectedDevices);
        trace ("selectedScreenshots: " +selectedScreenshots);
        //trace ("selectedLanguages: "+ selectedLanguages);


          
        box.close();
        
         
        generateScreenshots();
    }


    box.layout.layout();
    box.show();
} 
 
main();