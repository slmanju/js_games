var data = [];
data.push({
    "category_type": "CATALOG",
    "category_name": "Electrical",
    "child_categories": [{
        "category_type": "CATEGORY",
        "category_name": "Lighting",
        "child_categories": [
            {
                "category_type": "SUBCATEGORY",
                "category_name": "LED",
                "child_categories": [],
                "products": [{
                        "name": "LED 1"
                    },
                    {
                        "name": "LED 2"
                    },
                    {
                        "name": "LED 3"
                    }
                ]
            },
            {
                "category_type": "SUBCATEGORY",
                "category_name": "Flood light",
                "child_categories": [],
                "products": [{
                        "name": "Flood light 1"
                    },
                    {
                        "name": "Flood light 2"
                    }
                ]
            }],
        "products": []
    }],
    "products": []
});

function generateProducts(data, id) {

}

function generateCategories(data, id) {
    var ul = document.createElement("UL");
    ul.setAttribute("id", "id-main");
    document.getElementById(id).appendChild(ul);
    data.forEach(function (leaf) {
        var type = leaf.category_type;
        var li = document.createElement("LI");
        li.setAttribute("id", leaf.category_name);
        var text = document.createTextNode(leaf.category_name);
        li.appendChild(text);
        ul.appendChild(li);
        generate(leaf.child_categories, leaf.category_name);
    });
}

// function generate(data, id, name) {
//     var ul = document.createElement("UL");
//     ul.setAttribute("id", "id-" + name);
//     document.getElementById(id).appendChild(ul);
//     data.forEach(function(leaf) {
//         var li = document.createElement("LI");
//         li.setAttribute("id", leaf.category_name);
//         var text = document.createTextNode(leaf.category_name);
//         li.appendChild(text);
//         ul.appendChild(li);
//         generate(leaf.child_categories, leaf.category_name, name + '-' + leaf.category_name);
//     });
// }

function appendProducts(products) {
    var html = '<ul>';

    products.forEach(function (product) {
        html = html + '<li>';
        html = html + product.name;
        html = html + '</li>';
    });

    html = html + '</ul>';

    return html;
}

function buildTree(data, ismain) {
    var html = '';
    html = html + ((ismain) ? '<ul>' : '<ul class="hide">');
    data.forEach(function (leaf) {
        html = html + '<li>';
        html = html + leaf.category_name;
        if (ismain) {
            html = html + ' + ';
        }
        if (leaf.child_categories.length > 0) {
            html = html + buildTree(leaf.child_categories);
        }
        if (leaf.products.length > 0) {
            html = html + appendProducts(leaf.products);
        }
        html = html + '</li>';
    });
    html += '</ul>';
    return html;
}

//generate(data, 'tree-container', 'main');

var html = buildTree(data, true);
document.getElementById('tree-container').innerHTML = html;