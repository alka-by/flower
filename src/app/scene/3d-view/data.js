export default
  {
    "domains": [
      {
        "width": 0,
        "depth": 0,
        "centerPoint": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "connections": [
          {
            "id": "0001",
            "opacity": 1,
            "source": "p_1",
            "target": "p_2"
          },
          {
            "id": "0002",
            "opacity": 1,
            "source": "p_1",
            "target": "p_3"
          },
          {
            "id": "0003",
            "opacity": 1,
            "source": "p_2",
            "target": "p_4"
          },
          {
            "id": "0004",
            "opacity": 1,
            "source": "p_2",
            "target": "p_5"
          },
          {
            "id": "0005",
            "opacity": 1,
            "source": "p_3",
            "target": "p_5"
          },
          {
            "id": "0006",
            "opacity": 1,
            "source": "p_3",
            "target": "p_6"
          },
          {
            "id": "0007",
            "opacity": 0.4,
            "source": "p_4",
            "target": "p_6"
          },
          {
            "id": "0008",
            "opacity": 0.4,
            "source": "p_5",
            "target": "p_6"
          },
          {
            "id": "0009",
            "opacity": 0.4,
            "source": "p_6",
            "target": "p_7"
          },{
            "id": "0010",
            "opacity": 0.4,
            "source": "p_3",
            "target": "p_8"
          }
        ],
        "points": [
          {
            "name": "p_1",
            "point": {
              "x": 0,
              "y": 0,
              "z": 0
            },
            "color": "rgb(153, 143, 231)",
            "emissive": "rgb(78, 72, 118)"
          }, {
            "name": "p_2",
            "point": {
              "x": 0,
              "y": 0,
              "z": 0
            },
            "color": "rgb(153, 143, 231)",
            "emissive": "rgb(78, 72, 118)"
          }, {
            "name": "p_3",
            "point": {
              "x": 0,
              "y": 0,
              "z": 0
            },
            "color": "rgb(153, 143, 231)",
            "emissive": "rgb(78, 72, 118)"
          }, {
            "name": "p_4",
            "point": {
              "x": 0,
              "y": 0,
              "z": 0
            },
            "color": "rgb(153, 143, 231)",
            "emissive": "rgb(78, 72, 118)"
          }, {
            "name": "p_5",
            "point": {
              "x": 0,
              "y": 0,
              "z": 0
            },
            "color": "rgb(153, 143, 231)",
            "emissive": "rgb(78, 72, 118)"
          }, {
            "name": "p_6",
            "point": {
              "x": 0,
              "y": 0,
              "z": 0
            },
            "color": "rgb(153, 143, 231)",
            "emissive": "rgb(78, 72, 118)"
          }, {
            "name": "p_7",
            "point": {
              "x": 0,
              "y": 0,
              "z": 0
            },
            "color": "rgb(153, 143, 231)",
            "emissive": "rgb(78, 72, 118)"
          },
          {
            "name": "p_8",
            "point": {
              "x": 0,
              "y": 0,
              "z": 0
            },
            "color": "rgb(153, 143, 231)",
            "emissive": "rgb(78, 72, 118)"
          }
        ]
      }
    ],
    "trails": [
      {
        "name": "trail_1",
        "nodes": ["p_1", "p_3", "p_5", "p_6", "p_7"],
        "links": ["0002", "0005", "0008", "0009"]
      }
    ]

  }