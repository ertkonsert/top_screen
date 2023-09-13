radio.onReceivedNumber(function (receivedNumber) {
    if (receivedNumber == 70) {
        if (xbar > 0) {
            led.unplot(xbar + 1, 0)
            xbar = xbar - 1
            led.plot(xbar, 0)
        }
    }
    if (receivedNumber == 80) {
        if (xbar < 3) {
            led.unplot(xbar, 0)
            xbar = xbar + 1
            led.plot(xbar + 1, 0)
        }
    }
})
function radioSend (send_x: number, send_y: number, send_angle_y: number, send_angle_x: number) {
    radio.sendValue("ball_y", 0)
    radio.sendValue("ball_x", send_x)
    radio.sendValue("angle_y", send_angle_y)
    radio.sendValue("angle_x", send_angle_x)
    state = "inactive"
}
function collisionCheck () {
    if (ball_x == xbar) {
        ball_angle_y = 1
        ball_angle_x = -1
    } else if (ball_x == xbar + 1) {
        ball_angle_y = 1
        ball_angle_x = 1
    } else {
        state = "inactive"
        basic.clearScreen()
        basic.showIcon(IconNames.Sad)
    }
}
radio.onReceivedString(function (receivedString) {
    if (receivedString == "reset") {
        state = "inactive"
        basic.clearScreen()
        xbar = 2
        led.plot(xbar, 0)
        led.plot(xbar + 1, 0)
    }
})
input.onButtonPressed(Button.B, function () {
    basic.showString("x:" + ball_x)
    basic.showString("y:" + ball_y)
    basic.showString("a:" + ball_angle_y)
    basic.showString("c:" + check)
})
radio.onReceivedValue(function (name, value) {
    if (name == "ball_y") {
        ball_y = value
        check += 1
    }
    if (name == "ball_x") {
        ball_x = value
        check += 1
    }
    if (name == "angle_y") {
        ball_angle_y = value
        check += 1
    }
    if (name == "angle_x") {
        ball_angle_x = value
        check += 1
    }
    if (check == 4) {
        state = "active"
        check = 0
    }
})
let check = 0
let ball_y = 0
let ball_angle_x = 0
let ball_angle_y = 0
let ball_x = 0
let state = ""
let xbar = 0
xbar = 2
radio.setGroup(65)
led.plot(xbar, 0)
led.plot(xbar + 1, 0)
basic.forever(function () {
    while (state == "active") {
        led.plot(ball_x, ball_y)
        basic.pause(500)
        if (ball_y + ball_angle_y < 1) {
            collisionCheck()
        }
        if (ball_y + ball_angle_y > 4) {
            if (ball_x + ball_angle_x > 4) {
                ball_angle_x = -1
            }
            if (ball_x + ball_angle_x < 0) {
                ball_angle_x = 1
            }
            radioSend(ball_x + ball_angle_x, 0, ball_angle_y, ball_angle_x)
        }
        if (ball_x + ball_angle_x < 0) {
            ball_angle_x = 1
        }
        if (ball_x + ball_angle_x > 4) {
            ball_angle_x = -1
        }
        led.unplot(ball_x, ball_y)
        ball_y += ball_angle_y
        ball_x += ball_angle_x
    }
})
