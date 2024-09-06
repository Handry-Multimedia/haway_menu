// Compiled using ts2gas 3.6.5 (TypeScript 4.7.4)
var doGet = function (e) {
    var data = getData();
    if (!data)
        return ContentService.createTextOutput('No data found');
    var settings = data.settings;
    var template = HtmlService.createTemplateFromFile('menu');
    template.data = JSON.stringify(data);
    template.logo = settings.logo;
    return template
        .evaluate()
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
        .setSandboxMode(HtmlService.SandboxMode.IFRAME)
        .addMetaTag('viewport', 'width=device-width, initial-scale=1')
        .setTitle("".concat(settings.name, " Menu"));
};
var getData = function () {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var settings = getSettings(ss);
    if (!settings)
        return null;
    var categories = getCategories(ss);
    var menu_items = getMenuItems(ss);
    if (!menu_items)
        return null;
    var data = {
        settings: settings,
        categories: categories,
        menu_items: menu_items
    };
    return data;
};
var getSettings = function (ss) {
    var settings_sheet = ss.getSheetByName(SHEET_NAMES.SETTINGS);
    if (!settings_sheet)
        return null;
    var data = settings_sheet.getDataRange().getValues();
    var settings = {
        name: data[0][1],
        logo: data[1][1],
        currency: data[2][1],
        background_image: data[3][1]
    };
    if (String(settings.logo).includes('drive.google.com')) {
        var fileId = String(settings.logo).split('/d/')[1].split('/')[0];
        var blob = DriveApp.getFileById(fileId).getBlob();
        var base64 = Utilities.base64Encode(blob.getBytes());
        settings.logo = "data:image/png;base64,".concat(base64);
    }
    if (String(settings.background_image).includes('drive.google.com')) {
        var backgroundImageFileId = String(settings.background_image).split('/d/')[1].split('/')[0];
        var backgroundImageBlob = DriveApp.getFileById(backgroundImageFileId).getBlob();
        var backgroundImageBase64 = Utilities.base64Encode(backgroundImageBlob.getBytes());
        settings.background_image = "data:image/jpg;base64,".concat(backgroundImageBase64);
    }
    return settings;
};
var getMenuItems = function (ss) {
    var menu_sheet = ss.getSheetByName(SHEET_NAMES.MENU);
    if (!menu_sheet)
        return null;
    var data = menu_sheet.getDataRange().getValues();
    var menu_items = [];
    for (var i = 1; i < data.length; i++) {
        var _a = data[i], name = _a[0], description = _a[1], price = _a[2], category = _a[3];
        if (!name)
            continue;
        var id = Math.random().toString(36).substring(2, 15);
        var item = {
            id: id,
            name: name,
            description: description,
            price: price,
            category: category
        };        
        menu_items.push(item);
    }
    return menu_items;
};
var getCategories = function (ss) {
    var categories_sheet = ss.getSheetByName(SHEET_NAMES.CATEGORIES);
    if (!categories_sheet)
        return [];
    var data = categories_sheet.getDataRange().getValues();
    var categories = [];
    for (var i = 1; i < data.length; i++) {
        var item = data[i][0];
        var name = String(item).trim();
        if (name)
            categories.push(name);
    }
    return categories;
};
