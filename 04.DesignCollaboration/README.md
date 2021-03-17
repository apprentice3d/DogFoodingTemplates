## Scenario #4: Design Collaboration

To use this template, copy the content of **_04.DesignCollaboration_** folder into frontent folder of your project.

This template expects a single websocket endpoint:

`/user` - to get version history and add a new version:

Upon connection, the information received will be in form of JSON with following structure

```javascript
{
    "user_name": "Designer #4",
        "log": [
        {
            "user": "Designer #1",
            "date": "March 11th, 2pm",
            "record": {
                "body_type": "model",
                "body_style": "Race Car",
                "color": "Red",
                "wheel_type": "On-Road",
                "size": "Small"
            }
        }
    ]
}
```

When saving a new version/state, a messages will be sent to `/user` websocket endpoint, having the following structure:

```javascript
{
    "user": "Designer #4",
        "date": "March 17, 2021, 12 AM",
        "record": {
            "body_type": "truck",
            "body_style": "Truck",
            "color": "Green",
            "wheel_type": "Winter",
            "size": "Monster"
    }
}
```
------

After all is implemented, the following behaviour is expected:

![Collaboration](https://user-images.githubusercontent.com/969404/111416280-fc021a00-86b9-11eb-8771-3792b3859f95.gif)