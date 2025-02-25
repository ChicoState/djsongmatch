#include "mainwindow.h"
#include "./ui_mainwindow.h"
#include "fileDialogHelper.h"
#include <QMessageBox>

MainWindow::MainWindow(QWidget *parent)
    : QMainWindow(parent)
    , ui(new Ui::MainWindow)
    , fileDialogHelper(new FileDialogHelper(this))  // Initialize helper
{
    ui->setupUi(this);

    // Automatically generated from Qt designer
    connect(ui->browseFiles, &QPushButton::clicked, this, &MainWindow::on_browseButton_clicked);
}

MainWindow::~MainWindow() {
    delete ui;
}

void MainWindow::on_browseButton_clicked() {
    // Call the helper to open the file dialog
    QString fileName = fileDialogHelper->openFileDialog(this);

    if (!fileName.isEmpty()) {
        // Show a popup with the selected file path or update a label
        QMessageBox::information(this, "File Selected", fileName);

        // Display file path on a label
        // ui->filePathLabel->setText(fileName);
    }
}
