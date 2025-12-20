// game.journal.getName("Live Map of Kitaria PDF").sheet.render(true)

let code = "LiveMap";
let page = 1;
if (ui.PDFoundry) {
    ui.PDFoundry.openPDFByCode(code, { page });
} else {
    ui.notifications.warn('PDFoundry must be installed to use source links.');
}