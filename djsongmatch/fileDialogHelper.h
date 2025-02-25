#ifndef FILEDIALOGHELPER_H
#define FILEDIALOGHELPER_H

#include <QObject>
#include <QString>
#include <QFileDialog>

class FileDialogHelper : public QObject {
    Q_OBJECT

public:
    explicit FileDialogHelper(QObject *parent = nullptr);
    QString openFileDialog(QWidget *parent = nullptr);  // Function to open the file dialog
};

#endif // FILEDIALOGHELPER_H
