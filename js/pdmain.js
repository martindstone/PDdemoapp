var default_routing_key = "R027OEE3GZ98CUTP0O70D2E0W0EN3BOJ";
var default_customer_name = "nobody@pagerduty.com";
var default_order_value = "$1079.99";

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function PDCEFEvent(event) {
    $.ajax({
        type: "POST",
        dataType: "json",
        contentType: 'application/json',
        url: "https://events.pagerduty.com/v2/enqueue",
        data: JSON.stringify(event),
        success: function(data) {
            console.log(`Success:`);
            console.log(data);
        },
        error: function(error) {
            console.log(`Error:`);
            console.log(error);
        }
    });
}

function PDChange(event) {
    $.ajax({
        type: "POST",
        dataType: "json",
        contentType: 'application/json',
        url: "https://events.pagerduty.com/v2/change/enqueue",
        data: JSON.stringify(event),
        success: function(data) {
            console.log(`Success:`);
            console.log(data);
        },
        error: function(error) {
            console.log(`Error:`);
            console.log(error);
        }
    });
}

function sendChangeEvent(routing_key) {
    var changeDate = new Date();
    changeDate.setMinutes (changeDate.getMinutes() - 30);
    
    var event = {
        "routing_key": routing_key,
        "payload": {
            "summary": "Build Success: Upgrade ecommerce Java backend",
            "timestamp": changeDate.toISOString(),
            "source": "CircleCI",
            "custom_details": {
                "build_state Value": "passed",
                "build_number": "2"
            }
        }
    };
    PDChange(event);
    console.log(event);
}

function sendNewRelicEvent(routing_key, customer_name, system_route, order_value) {
    var event = {
        "payload": {
            "summary": "[Critical] Increased response time detected on the Checkout page, High Error rates",
            "source": "monitoringtool:cloudvendor:central-region-dc-01:852559987:cluster/api-stats-prod-003",
            "severity": "critical",
            "component": "store",
            "group": "ecom",
            "custom_details": {
                "body": `[Critical] Increased response time detected on the Checkout page affecting ${customer_name}, High Error rates <br/> Object Reference Not Set and ADO.NET Connection pool exceeded errors detected`,
                "Order Value": order_value,
                "priority": "High",
                "event_id": "8125363154448140714",
                "tags": "aws-prod, base, env:prod, host:farnsworth, monitor, pd_az:us-west-2c, production, xdb, xtradb",
                "Customer": customer_name,
                "SystemRoute": system_route
            }
        },
        "routing_key": routing_key,
        "dedup_key": "" + (new Date()).getTime(),
        "images": [{
            "src": "https://s3.eu-west-2.amazonaws.com/www.timchinchen.co.uk/DemoImages/NRErrors2.png",
            "href": "http://www.timchinchen.co.uk/DemoImages/NRErrors1.png",
            "alt": "Snapshot of metric"
        }],
        "links": [{
                "href": "https://pagerduty.zoom.us/j/5080555253",
                "text": "Conference URL (Zoom)"
            },
            {
                "href": "tel:+442036950088,,5080555253#",
                "text": "Conference Call (Zoom)"
            },
            {
                "href": "https://appp.datadoghq.com/monitors#72563?to_ts=1452282540000&group=host%3Aprod-web-xdb09&from_ts=1452281340000",
                "text": "Monitor Status"
            },
            {
                "href": "https://rpm.newrelic.com/accounts/1818495/applications/105833762?tw%5Bend%5D=1518535392&tw%5Bstart%5D=1518528373",
                "text": "New Relic - Permalink"
            },
        ],
        "event_action": "trigger",
        "client": "New Relic",
        "client_url": "https://rpm.newrelic.com/accounts/1818495/applications/105833762"
    };
    PDCEFEvent(event);
}

function sendZabbixEvent(routing_key, customer_name, system_route, order_value) {
    var event = {
        "payload": {
            "summary": "java.lang.OutOfMemoryError: Java heap space",
            "source": "Zabbix",
            "severity": "warning",
            "location": "prod",
            "component": "Zabbix",
            "group": "Zabbix,Production,eCommerce,Checkout-Tier",
            "class": "Zabbix",
            "custom_details": {
                "Order Value": order_value,
                "Customer": customer_name,
                "SystemRoute": system_route
            }
        },
        "routing_key": routing_key,
        "dedup_key": "" + (new Date()).getTime(),
        "event_action": "trigger",
        "client": "View in Zabbix",
        "client_url": "www.zabbix.com",
        "SystemRoute": system_route,
        "images": [{
            "src": "https://chart.googleapis.com/chart?chs=600x400&chd=t:6,2,9,5,2,5,7,4,8,2,1&cht=lc&chds=a&chxt=y&chm=D,0033FF,0,0,5,1",
            "href": "https://acme.pagerduty.com",
            "alt": "This is a sample link"
        }]
    };
    PDCEFEvent(event);
}

function sendLowRevenueWarning(routing_key, customer_name, system_route, order_value) {
    var event = {
        "payload": {
            "summary": "Low Revenue detected compared to normal",
            "source": "Prometheus",
            "severity": "warning",
            "location": "prod",
            "component": "Prometheus",
            "group": "Prometheus,Production,eCommerce,Checkout-Tier",
            "class": "Prometheus",
            "custom_details": {
                "Order Value": order_value,
                "Customer": customer_name,
                "SystemRoute": system_route
            }
        },
        "routing_key": routing_key,
        "dedup_key": "" + (new Date()).getTime(),
        "event_action": "trigger",
        "client": "View in Prometheus",
        "client_url": "www.Prometheus.com",
        "SystemRoute": system_route,
        "images": [{
            "src": "https://logz.io/wp-content/uploads/2017/03/memory-graph.png",
            "href": "https://logz.io/wp-content/uploads/2017/03/memory-graph.png",
            "alt": "This is a sample link"
        }]
    };
    PDCEFEvent(event);
}

function sendEvents() {
    customer_name = sessionStorage.getItem('customer_name') || default_customer_name;
    routing_key = sessionStorage.getItem('routing_key') || default_routing_key;
    order_value = sessionStorage.getItem('order_value') || default_order_value;
    sendNewRelicEvent(routing_key, customer_name, "/cart.html", order_value);
    sendChangeEvent(routing_key);
    setTimeout(function() {
        sendZabbixEvent(routing_key, customer_name, "/cart.html", order_value);
    }, 2000);
    setTimeout(function() {
        sendLowRevenueWarning(routing_key, customer_name, "/cart.html", order_value);
    }, 2000);
    setTimeout(function() {
        window.location.href = "error.html";
    }, 3500);
}

function main() {
    $('#checkout-button').click(function() {
        sendEvents();
    });
}

$(document).ready(main);