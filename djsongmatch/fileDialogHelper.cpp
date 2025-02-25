#include "filedialoghelper.h"

FileDialogHelper::FileDialogHelper(QObject *parent)
    : QObject(parent) {}

QString FileDialogHelper::openFileDialog(QWidget *parent) {
    return QFileDialog::getOpenFileName(
        parent,
        "Select a File",
        "",
        "Audio Files (*.mp3 *.wav *.flac);;All Files (*)"
        );
}
