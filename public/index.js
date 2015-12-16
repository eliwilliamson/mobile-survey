$(function() {

    // Chart effective rating
    function quality(results) {
        // Collect age results
        var data = {};
        for (var i = 0, l = results.length; i < l; i++) {
            var qualityResponse = results[i].responses[0];
            var k = String(qualityResponse.answer);
            if (!data[k]) data[k] = 1;
            else data[k]++;
        }

        // Assemble for graph
        var labels = Object.keys(data);
        var dataSet = [];
        for (var k in data)
            dataSet.push(data[k]);

        // Render chart
        var ctx = document.getElementById('qualityChart').getContext('2d');
        var qualityChart = new Chart(ctx).Bar({
            labels: labels,
            datasets: [{
                label: 'quality',
                data: dataSet
            }]
        });
    }

    function future(results) {
        // Collect age results
        var data = {};
        for (var i = 0, l = results.length; i < l; i++) {
            var futureResponse = results[i].responses[1];
            var k = String(futureResponse.answer);
            if (!data[k]) data[k] = 1;
            else data[k]++;
        }

        // Assemble for graph
        var labels = Object.keys(data);
        var dataSet = [];
        for (var k in data)
            dataSet.push(data[k]);

        // Render chart
        var ctx = document.getElementById('futureChart').getContext('2d');
        var futureChart = new Chart(ctx).Bar({
            labels: labels,
            datasets: [{
                label: 'future',
                data: dataSet
            }]
        });
    }

        function finance(results) {
        // Collect age results
        var data = {};
        for (var i = 0, l = results.length; i < l; i++) {
            var financeResponse = results[i].responses[2];
            var k = String(financeResponse.answer);
            if (!data[k]) data[k] = 1;
            else data[k]++;
        }

        // Assemble for graph
        var labels = Object.keys(data);
        var dataSet = [];
        for (var k in data)
            dataSet.push(data[k]);

        // Render chart
        var ctx = document.getElementById('financeChart').getContext('2d');
        var financeChart = new Chart(ctx).Bar({
            labels: labels,
            datasets: [{
                label: 'finance',
                data: dataSet
            }]
        });
    }

    // poor man's html template for a response table row
    function row(response) {
        var tpl = '<tr><td>';
        tpl += response.answer || 'pending...' + '</td>';
        if (response.recordingUrl) {
            tpl += '<td><a target="_blank" href="' + response.recordingUrl + '"><i class="fa fa-play"></i></a></td>';
        }
        tpl += '</tr>';
        return tpl;
    }

    // add text responses to a table
    function freeText1(results) {
        var $responses = $('#feedbackResponses');
        var content = '';
        for (var i = 0, l = results.length; i < l; i++) {
            var feedbackResponse = results[i].responses[8];
            content += row(feedbackResponse);
        }
        $responses.append(content);
    }

        // add text responses to a table
    // function freeText2(results) {
    //     var $responses = $('#confusionResponses');
    //     var content = '';
    //     for (var i = 0, l = results.length; i < l; i++) {
    //         var confusionResponse = results[i].responses[4];
    //         content += row(confusionResponse);
    //     }
    //     $responses.append(content);
    // }

    // Load current results from server
    $.ajax({
        url: '/results',
        method: 'GET'
    }).done(function(data) {
        // Update charts and tables
        $('#total').html(data.results.length);
        future(data.results);
        quality(data.results);
        finance(data.results);
        freeText1(data.results);
        // freeText2(data.results);
    }).fail(function(err) {
        console.log(err);
        alert('failed to load results data :(');
    });
});