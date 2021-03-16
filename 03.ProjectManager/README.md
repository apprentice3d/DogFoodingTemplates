## Scenario #3: Project Manager Design Feedback and Approval

To use this template, copy the content of **_03.ProjectManager_** folder into frontent folder of your project.

This template expects 3 websocket endpoints:

1. `/client` - to get comment history and add new comments:

The information received will be in form of JSON with following structure

```javascript
{
    "design_name": "Car Toy #1",
    "body_design": "Body Design #2",
    "messages": [
        {
            "user": "Client",
            "date": "March 16, 2021, 10 AM",
            "message": "Are there any other options?"
        },
        {
            "user": "Client",
            "date": "March 16, 2021, 10 AM",
            "message": "Oh no ... this looks too real."
        },
        {
            "user": "Client",
            "date": "March 16, 2021, 10 AM",
            "message": "Yeah ... it is ok, but I prefer the first one."
        },
        {
            "user": "Client",
            "date": "March 16, 2021, 10 AM",
            "message": "Yep."
        }
    ],
    "body_type": "model"
}
```

New messages will also be sent to `/client` websocket endpoint, having the following structure:

```javascript
{
    "user": "Client",
    "date": "March 16, 2021, 11 AM",
    "message": "This is a new comment."
}
```

2. `/pm` to get client's comments and set project status:
   
The information received will be in form of JSON with following structure:
 
```javascript
 {
    "design_name": "Car Toy #1",
        "body_design": "Body Design #2",
        "messages": [
        {
            "user": "Client",
            "date": "March 16, 2021, 10 AM",
            "message": "Are there any other options?"
        },
        {
            "user": "Project Manager",
            "date": "March 16, 2021, 10 AM",
            "message": "Review status changed to Review",
            "status": "Review"
        },
        {
            "user": "Designer",
            "date": "March 16, 2021, 10 AM",
            "message": "Design updated to Body Design #1",
            "body_type": "sedan",
            "design": "Body Design #1"
        }
    ],
        "status": "Review",
        "body_type": "model"
}
 ```

New status will also be sent to `/pm` websocket endpoint, having the following structure:

```javascript
{
    "user": "Project Manager",
        "date": "March 16, 2021, 11 AM",
        "message": "Review status changed to Review",
        "status": "Review"
}
```

3. `/designer` - to get client's comments, project status and change the design:
   
The information received will be in form of JSON with following structure:

```javascript
{
    "design_name": "Car Toy #1",
    "body_design": "Body Design #2",
    "messages": [
        {
            "user": "Client",
            "date": "March 16, 2021, 10 AM",
            "message": "Are there any other options?"
        },
        {
            "user": "Project Manager",
            "date": "March 16, 2021, 10 AM",
            "message": "Review status changed to Review",
            "status": "Review"
        },
        {
            "user": "Designer",
            "date": "March 16, 2021, 10 AM",
            "message": "Design updated to Body Design #1",
            "body_type": "sedan",
            "design": "Body Design #1"
        }
    ],
    "status": "Review",
    "body_type": "model"
}
```

New design choice will also be sent to `/designer` websocket endpoint, having the following structure:
 
```javascript
{
    "user": "Designer",
    "date": "March 16, 2021, 11 AM",
    "message": "Design updated to Body Design #3",
    "body_type": "truck",
    "design": "Body Design #3"
}
```

-----

After all is implemented, the following behaviour is expected:
![PM_EXAMPLE](https://user-images.githubusercontent.com/969404/111329844-d0dde300-8645-11eb-9d7b-96c0b23d9c5e.gif)
