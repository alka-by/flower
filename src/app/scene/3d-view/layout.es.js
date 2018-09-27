import * as d3 from 'd3';
import createGraph from 'ngraph.graph';
import createLayout from 'ngraph.forcelayout3d';

const GRAPH_3D_LAYOUT_STEPS_COUNT = 50; //if data contains more elements - increase this count

let apply3dLayout = (model) => {

  let graph = createGraph();

  model.domains[0].points.forEach((point) => {
      graph.addNode(point.name);
  });

  model.domains[0].connections.forEach((con) => {
      graph.addLink(con.source, con.target);
  });

  /*define simulator parameters*/
  let simulator = {gravity: -2.0, theta: 1};

  let layout = createLayout(graph, simulator);

  /*layout optimisation*/
  for (let i = 0; i < GRAPH_3D_LAYOUT_STEPS_COUNT; ++i) {
      layout.step();
  }

  let updateModel = () => {

      let crd = {};

      graph.forEachNode((node) => {
          let id = node.id;
          let point = layout.getNodePosition(id);
          let x = Math.round(point.x);
          let y = Math.round(point.y);
          let z = Math.round(point.z);
          crd[id] = {x: x, y: y, z: z};
      });

      model.domains.forEach((domain) => {
          let rect = layout.getGraphRect();
          let size = Math.round((
              Math.abs(rect.x1 - rect.x2) +
              Math.abs(rect.y1 - rect.y2) +
              Math.abs(rect.z1 - rect.z2)) / 3
          );
          domain.depth = size;
          domain.width = size;

          domain.centerPoint = {x: 0, y: 0, z: 0};
          domain.points.forEach((el) => {
              el.point = {
                  x: crd[el.name].z - Math.round((rect.z1 + rect.z2) / 2),
                  y: crd[el.name].x - Math.round((rect.x1 + rect.x2) / 2),
                  z: crd[el.name].y - Math.round((rect.y1 + rect.y2) / 2)
              };
          });
      });
  };

  updateModel();
  console.log(model);
  return model;
};

export {apply3dLayout};