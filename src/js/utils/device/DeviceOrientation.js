import EventEmitter from "../EventEmitter"

export default class DeviceOrientation extends EventEmitter {
    constructor() {
        super()

        /** coordinates */
        this.alpha = 0 // around z axis (0 to 360)
        this.gamma = 0 // around y axis = left to right (-180 to 180)
        this.beta = 0 // around x axis = front to back (-90 to 90)

        /** permission */
        if (navigator.permissions) {
            Promise.all(
                [navigator.permissions.query({ name: "accelerometer" }),
                navigator.permissions.query({ name: "magnetometer" }),
                navigator.permissions.query({ name: "gyroscope" })])
                .then(results => {
                    if (results.every(
                        result => result.state === "granted")) {
                        this.init()
                    } else {
                        console.log("Permission to use sensor was denied.")
                    }
                }).catch(err => {
                    console.log("Integration with Permissions API is not enabled, still try to start app.")
                    this.init()
                })
        } else {
            console.log("No Permissions API, still try to start app.")
            this.init()
        }
    }

    init() {
        window.addEventListener(
            "deviceorientation",
            (event) => {
                this.alpha = event.alpha
                this.gamma = event.gamma
                this.beta = event.beta

                this.trigger("reading")
            },
            true,
        )
    }
}