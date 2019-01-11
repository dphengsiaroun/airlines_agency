require([
    'underscore',
    'jquery',
    'splunkjs/mvc',
    'splunkjs/mvc/tableview',
    'splunkjs/mvc/simplexml/ready!'
], function (_, $, mvc, TableView) {

    // Row Coloring Example with custom, client-side range interpretation

    var CustomRangeRenderer = TableView.BaseCellRenderer.extend({
        canRender: function (cell) {
            // Enable this custom cell renderer for both the active_hist_searches and the active_realtime_searches field
            return _(['status']).contains(cell.field);
        },
        render: function ($td, cell) {
            // Add a class to the cell based on the returned value
            var value = String(cell.value);

            // Apply interpretation for number of historical searches
            if (cell.field === 'status') {
                console.log('cell', cell);
                if (value == "Validated") {
                    $td.addClass('range-cell').addClass('range-severe');
                }
                if (value == "Stand by") {
                    $td.addClass('range-cell').addClass('range-low');
                }
                if (value == "Cancelled") {
                    $td.addClass('range-cell').addClass('range-confirm');
                }
                if (value == "In progress") {
                    $td.addClass('range-cell').addClass('range-back');
                }
            }
            // Update the cell content
            $td.text(value.split(';')[0]).addClass('text');
        }
    });
    if (typeof mvc.Components.get('tableListTravelers') != typeof undefined) {
        mvc.Components.get('tableListTravelers').getVisualization(function (tableView) {
            tableView.on('rendered', function () {
                // Apply class of the cells to the parent row in order to color the whole row
                tableView.$el.find('td.range-cell').each(function () {
                    $(this).parents('tr').addClass(this.className);
                });
            });
            // Add custom cell renderer, the table will re-render automatically.
            tableView.addCellRenderer(new CustomRangeRenderer());
        });
    }


    if (typeof mvc.Components.get('transit_table') != typeof undefined) {
        mvc.Components.get('transit_table').getVisualization(function (tableView) {
            tableView.on('rendered', function () {
                // Apply class of the cells to the parent row in order to color the whole row
                tableView.$el.find('td.range-cell').each(function () {
                    $(this).parents('tr').addClass(this.className);
                });
            });
            // Add custom cell renderer, the table will re-render automatically.
            tableView.addCellRenderer(new CustomRangeRenderer());
        });
    }


});