## Scenario #1: Parts Catalogue and Inventory tracking

To use this template, copy the content of **_01.Inventory_** folder into frontent folder of your project.

This template expects 3 endpoints:

1. `GET /records` - to load invetory data into table,
    expecting data in following form:
``` 
[
  ["wheel", "ww001", "Wheel, Wood", "WoodWrx", "Wood Racer", "$3.00", "21"],
  ["wheel", "mw002", "Wheel, Metal", "MorMetal", "Metal Sedan", "$3.00", "14"],
  ["axle", "mw001", "Axle", "MorMetal", "Wood Racer, Metal Sedan", "$2.00", "2"],
  ["body", "ww002", "Body, Red", "WoodWrx", "Wood Racer, Metal Sedan", "$4.00", "18"],
  ["body", "ww003", "Body, Blue", "WoodWrx", "Wood Racer, Metal Sedan", "$4.00", "16"],
  ["body", "ww004", "Body, Green", "WoodWrx", "Wood Racer, Metal Sedan", "$4.00", "12"],
  ["body", "ww005", "Body, Yellow", "WoodWrx", "Wood Racer, Metal Sedan", "$4.00", "11"],
  ["body", "ww006", "Body, Natural", "WoodWrx", "Wood Racer, Metal Sedan", "$4.00", "10"],
]
```
    
 2. `POST /newrecord` to add a new record to inventory by passing a JSON like:
 
 ```
 {
    cost: "12.23"
    part_name: "Body, Black"
    part_no: "ww007"
    quantity: "22"
    type: "axle"
    used_in: "WoodRacer"
    vendor: "Me"
 }
 ```
 
 and expecting data in same form as in case of endpoint (1)
 
 3. `POST /filter` to get all records abidding to given filter, where the filter will be sent in form of:

```
{
    "filter": "Wheel"
}
```

 and expecting data in same form as in case of endpoint (1)
 
 -----

After all is implemented, the following behaviour is expected:

![](https://user-images.githubusercontent.com/969404/111041220-49099600-8405-11eb-93ad-d21f3e8ae14e.mp4)
![](https://user-images.githubusercontent.com/969404/111041270-69395500-8405-11eb-81b3-a0199428bdbb.gif)
