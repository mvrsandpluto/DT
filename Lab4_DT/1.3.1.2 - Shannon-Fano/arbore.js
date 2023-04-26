
var treeData =
  {
    "name": "A0",
    "children": [
      {
        "name": "Level 1: A0R",
        "children": [
          { "name": "Level 2: A0RR",
              "children": [
                { "name": "Level 3: A0RRR",
                    "children": [
                      { "name": "Level 4: A0RRRR",
                          "children": [
                            { "name": "Level 5: A0RRRRR = V" },
                            { "name": "Level 5: A0RRRRL = S" }
                          ]
                      },
                      { "name": "Level 4: A0RRRL",
                          "children": [
                            { "name": "Level 5: A0RRRLR = L" },
                            { "name": "Level 5: A0RRRLL = H" }
                          ]
                      }
                    ]
                },
                { "name": "Level 3: A0RRL",
                    "children": [
                      { "name": "Level 4: A0RRLR",
                          "children": [
                            { "name": "Level 5: A0RRLRR = B" },
                            { "name": "Level 5: A0RRLRL = ." }
                          ]
                      },
                      { "name": "Level 4: A0RRLL = N" }
                    ]
                }
              ]
          },
          { "name": "Level 2: A0RL",
              "children": [
                { "name": "Level 3: A0RLR",
                    "children": [
                      { "name": "Level 4: A0RLRR = I" },
                      { "name": "Level 4: A0RLRL = A" }
                    ]
                },
                { "name": "Level 3: A0RLL = R" }
              ]
          }
        ]
      },
      { "name": "Level 1: A0L",
        "children": [
          { "name": "Level 2: A0LR",
              "children": [
                { "name": "Level 3: A0LRR = T" },
                { "name": "Level 3: A0LRL = E" }
              ]
         },
          { "name": "Level 2: A0LL = spatiu" }
        ]
	  }
    ]
  };

// SHANNON CODE

function on_button() {
// var text=document.getElementById("ms").value;
var text=document.getElementById("ms").value;

var v = [];

Array.from(text).forEach((e, i) => {
    if (v[e]) {
        v[e] = v[e] + 1;
    } else
        v[e] = 1;
});


var keys = Object.keys(v).sort().reverse().sort((a, b) => {
    return v[a] - v[b];
}).reverse();

var sorted = [];
keys.forEach((e, i) => {
    sorted[e] = v[e];
});

var treeData = construct(sorted, 0, keys.length, "O", "A", 0);

draw_rest(treeData);
}

// the sorted array, left index, right index, flag to know if its the left,
// or right branch to sort the name out, name of the current node
// also level to keep track of the level we are at
function construct(sorted, l, r, flag, name, level) {
    var node = {};
    
    // get the keys from the sorted array so we can make use of indexes
    // somewhere check if the r - l is 1
    // NOTE: not sure to verify r-l == 1 or 0
    keys = Object.keys(sorted);

    if (level == 0) {
        node["name"] = "A0";
    } else {
        node["name"] = "Level " + level + ": " +
            name.slice(name.indexOf(':') == -1 ? 0 : name.indexOf(':') + 2)
                + flag;
    }

    if (r - l == 1) {
        node["name"] = node["name"] + " = " + keys[l];
        return node;
    } 

    // compute sum of frequencies to cut the vector in half
    var sum = 0;
    for (var i = l; i < r; i++) {
        sum += sorted[keys[i]];
    }

    // decide how to split the vector
    var ssum = 0;
    var index; // index on which we split
    for (var i = l; i < r; i++) {
        if (ssum + sorted[keys[i]] < sum/2) {
            ssum += sorted[keys[i]];
        } else {
            // check if we can push one more so we don't get to be too
            // unbalanced
            if (sum/2 - ssum < ssum + sorted[keys[i]] - sum/2) {
                // break here
                index = i;
                break;
            }
            // break next index
            index = i + 1;
            break
        }
    }

    // construct the node recursively and return it
    node["children"] =
        [construct(sorted, l, index, "L", node["name"], level + 1),
        construct(sorted, index, r, "R", node["name"], level + 1)];

    return node;
}
// FINISH

function draw_rest(treeData) {

// Set the dimensions and margins of the diagram
var margin = {top: 20, right: 90, bottom: 30, left: 90},
    width = 3060 - margin.left - margin.right,
    height = 1000 - margin.top - margin.bottom;

	
// append the svg object to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate("
          + margin.left + "," + margin.top + ")");

var i = 0,
    duration = 750,
    root;

// declares a tree layout and assigns the size
var treemap = d3.tree().size([height, width]);

// Assigns parent, children, height, depth
root = d3.hierarchy(treeData, function(d) { return d.children; });
root.x0 = height / 2;
root.y0 = 0;

// Collapse after the second level
root.children.forEach(collapse);

update(root);

// Collapse the node and all it's children
function collapse(d) {
  if(d.children) {
    d._children = d.children
    d._children.forEach(collapse)
    d.children = null
  }
}

function update(source) {

  // Assigns the x and y position for the nodes
  var treeData = treemap(root);

  // Compute the new tree layout.
  var nodes = treeData.descendants(),
      links = treeData.descendants().slice(1);

  // Normalize for fixed-depth.
  nodes.forEach(function(d){ d.y = d.depth * 180});

  // ****************** Nodes section ***************************

  // Update the nodes...
  var node = svg.selectAll('g.node')
      .data(nodes, function(d) {return d.id || (d.id = ++i); });

  // Enter any new modes at the parent's previous position.
  var nodeEnter = node.enter().append('g')
      .attr('class', 'node')
      .attr("transform", function(d) {
        return "translate(" + source.y0 + "," + source.x0 + ")";
    })
    .on('click', click);

  // Add Circle for the nodes
  nodeEnter.append('circle')
      .attr('class', 'node')
      .attr('r', 1e-6)
      .style("fill", function(d) {
          return d._children ? "lightsteelblue" : "#fff";
      });

  // Add labels for the nodes
  nodeEnter.append('text')
      .attr("dy", ".35em")
      .attr("x", function(d) {
          return d.children || d._children ? -13 : 13;
      })
      .attr("text-anchor", function(d) {
          return d.children || d._children ? "end" : "start";
      })
      .text(function(d) { return d.data.name; });

  // UPDATE
  var nodeUpdate = nodeEnter.merge(node);

  // Transition to the proper position for the node
  nodeUpdate.transition()
    .duration(duration)
    .attr("transform", function(d) { 
        return "translate(" + d.y + "," + d.x + ")";
     });

  // Update the node attributes and style
  nodeUpdate.select('circle.node')
    .attr('r', 10)
    .style("fill", function(d) {
        return d._children ? "lightsteelblue" : "#fff";
    })
    .attr('cursor', 'pointer');


  // Remove any exiting nodes
  var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) {
          return "translate(" + source.y + "," + source.x + ")";
      })
      .remove();

  // On exit reduce the node circles size to 0
  nodeExit.select('circle')
    .attr('r', 1e-6);

  // On exit reduce the opacity of text labels
  nodeExit.select('text')
    .style('fill-opacity', 1e-6);

  // ****************** links section ***************************

  // Update the links...
  var link = svg.selectAll('path.link')
      .data(links, function(d) { return d.id; });

  // Enter any new links at the parent's previous position.
  var linkEnter = link.enter().insert('path', "g")
      .attr("class", "link")
      .attr('d', function(d){
        var o = {x: source.x0, y: source.y0}
        return diagonal(o, o)
      });

  // UPDATE
  var linkUpdate = linkEnter.merge(link);

  // Transition back to the parent element position
  linkUpdate.transition()
      .duration(duration)
      .attr('d', function(d){ return diagonal(d, d.parent) });

  // Remove any exiting links
  var linkExit = link.exit().transition()
      .duration(duration)
      .attr('d', function(d) {
        var o = {x: source.x, y: source.y}
        return diagonal(o, o)
      })
      .remove();

  // Store the old positions for transition.
  nodes.forEach(function(d){
    d.x0 = d.x;
    d.y0 = d.y;
  });

  // Creates a curved (diagonal) path from parent to the child nodes
  function diagonal(s, d) {

    path = `M ${s.y} ${s.x}
            C ${(s.y + d.y) / 2} ${s.x},
              ${(s.y + d.y) / 2} ${d.x},
              ${d.y} ${d.x}`

    return path
  }

  // Toggle children on click.
  function click(d) {
    if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
    update(d);
  }
}
// compute original size
var text=document.getElementById("ms").value;
var originalSize = text.length * 8;

// compute compressed size
var compressedSize = 0;
Object.keys(sorted).forEach((e, i) => {
    compressedSize += sorted[e].toString(2).length * v[e];
});

// compute compression rate
var compressionRate = (originalSize - compressedSize) / originalSize * 100;

// output compression rate
console.log("Compression rate: " + compressionRate.toFixed(2) + "%");


}
