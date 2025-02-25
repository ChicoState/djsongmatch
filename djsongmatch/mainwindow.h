#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>
#include "filedialoghelper.h"

QT_BEGIN_NAMESPACE
namespace Ui { class MainWindow; }
QT_END_NAMESPACE

class MainWindow : public QMainWindow
{
    Q_OBJECT

public:
    MainWindow(QWidget *parent = nullptr);
    ~MainWindow();

private slots:
    void on_browseButton_clicked();  // Slot to handle the Browse button click'
    // Special Qt section indicating that functions are slots (can respond to signals)
    // Functions cannot be connected to Qt signals unless marked as a slot.

private:
    Ui::MainWindow *ui;
    FileDialogHelper *fileDialogHelper;  // Helper for file dialog
};

#endif // MAINWINDOW_H
