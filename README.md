# Capstone Project (403)

This project consists of 4 subsystems: power, GUI (physical), microcontroller, and web interface/database. The whole system took in sensor inputs, converted the readings into numerical values, and displayed them on the GUI (physical) and web interface. For the web interface to receive information, the microconroller had to send values to the database (at least once per second). 

My role was to create a web interface which displayed the information being sent from the sensors. The values were uploaded to the SQL database (by the microcontroller) and displayed using graphs and live counts. One other function is to communicate back to the microcontroller. For example, if the user wanted to change a setting from the web interface (such as the minimum/maximum value of the sensor or any alarm triggers), the web interface should be able to handle this by asking the user what they want to change, and updating the settings accordingly. This was done through an HTML form that sent the new values to a PHP form, sent it to the database, which was then read by the microcontroller.

To read the data from the SQL database, I used ajax requests to open a PHP file, which then sent the data back in JSON format. 

To create the interface and make it responsive to allow for mobile use, I used HTML, CSS, and Javascript (d3.js, JQuery).

The database had 2 tables: one for values and one for settings. This allows for queries that request values of sensors to be executed faster since there would be less information to look through. 
