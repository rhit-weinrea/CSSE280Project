#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases.
; #Warn  ; Enable warnings to assist with detecting common errors.
SendMode Input  ; Recommended for new scripts due to its superior speed and reliability.
SetWorkingDir %A_ScriptDir%  ; Ensures a consistent starting directory.

; Coordinates for Submit button
	submitX = 1850
	submitY = 1010 ; Change this to 1010 if your taskbar doesn't collapse!!!!!!! Test it out using the summer registration form before using.

]::
	
	Send, 1561
	Send, {Tab}
	Send, {Enter}
	Send, 1104
	Send, {Tab}
	Send, {Enter}
	Send, 1128
	Send, {Tab}
	Send, {Enter}
	Send, 1132
	Send, {Tab}
	Send, {Enter}
	Send, 1071
	Send, {Tab}
	Send, {Tab}
	Send, {Enter}

	click , %submitX%, %submitY%
Return

\::
	Send, {Browser_Refresh}
Return

[::
	Send, 772569
	Send, {Tab}
	Send, {Enter}
Return

$esc:: ExitApp