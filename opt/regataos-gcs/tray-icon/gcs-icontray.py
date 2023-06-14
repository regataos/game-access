#!/usr/bin/python3

import os
import sys
from PyQt5.QtGui import QIcon
from PyQt5.QtWidgets import QApplication, QMenu, QSystemTrayIcon

class SystemTrayIcon(QSystemTrayIcon):
    def __init__(self, icon, parent=None):
        super(SystemTrayIcon, self).__init__(icon, parent)

        self.menu = QMenu(parent)

        def open_gcs():
            os.system('cd /usr/share/applications/; gtk-launch "regataos-gcs.desktop"')

        def close_gcs():
            os.system('/bin/bash gcs_icontray_functions -close-gcs-app')

        updateSystem = os.popen('/bin/bash set_language_icontray -open-gcs')
        updateSystem = updateSystem.read().rstrip('\n')
        self.left_action = self.menu.addAction(updateSystem)
        self.left_action.triggered.connect(open_gcs)

        openUpdateManager = os.popen('/bin/bash set_language_icontray -close-gcs')
        openUpdateManager = openUpdateManager.read().rstrip('\n')
        self.right_action = self.menu.addAction(openUpdateManager)
        self.right_action.triggered.connect(close_gcs)

        self.setContextMenu(self.menu)
        self.activated.connect(self.onTrayIconActivated)

    def onTrayIconActivated(self, reason):
        if reason == QSystemTrayIcon.Trigger:
            print("Click with the left mouse button.")
            os.system('cd /usr/share/applications/; gtk-launch "regataos-gcs.desktop"')

        elif reason == QSystemTrayIcon.Context:
            print("Click with the right mouse button.")

def main():
    app = QApplication(sys.argv)

    # System tray icon information
    icon = QIcon("regataos-gcs.png")
    tray_icon = SystemTrayIcon(icon)
    title = os.popen('/bin/bash set_language_icontray -icon-title')
    title = title.read().rstrip('\n')
    tray_icon.setToolTip(title)
    tray_icon.show()

    sys.exit(app.exec_())

if __name__ == "__main__":
    main()
