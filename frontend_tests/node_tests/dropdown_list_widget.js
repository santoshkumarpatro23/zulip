"use strict";

const {strict: assert} = require("assert");

const {i18n} = require("../zjsunit/i18n");
const {mock_cjs, mock_esm, zrequire} = require("../zjsunit/namespace");
const {run_test} = require("../zjsunit/test");
const blueslip = require("../zjsunit/zblueslip");
const $ = require("../zjsunit/zjquery");

const noop = () => {};
mock_cjs("jquery", $);
mock_esm("../../static/js/list_widget", {
    create: () => ({init: noop}),
});
const {DropdownListWidget: dropdown_list_widget} = zrequire("dropdown_list_widget");

const setup_zjquery_data = (name) => {
    const input_group = $(".input_group");
    const reset_button = $(".dropdown_list_reset_button");
    input_group.set_find_results(".dropdown_list_reset_button:enabled", reset_button);
    $(`#${CSS.escape(name)}_widget #${CSS.escape(name)}_name`).closest = () => input_group;
    const $widget = $(`#${CSS.escape(name)}_widget #${CSS.escape(name)}_name`);
    return {reset_button, $widget};
};

run_test("basic_functions", () => {
    let updated_value;
    const opts = {
        widget_name: "my_setting",
        data: ["one", "two", "three"].map((x) => ({name: x, value: x})),
        value: "one",
        on_update: (val) => {
            updated_value = val;
        },
        default_text: i18n.t("not set"),
        render_text: (text) => `rendered: ${text}`,
    };

    const {reset_button, $widget} = setup_zjquery_data(opts.widget_name);

    const widget = dropdown_list_widget(opts);

    assert.equal(widget.value(), "one");
    assert.equal(updated_value, undefined); // We haven't 'updated' the widget yet.
    assert(reset_button.visible());

    widget.update("two");
    assert.equal($widget.text(), "rendered: two");
    assert.equal(widget.value(), "two");
    assert.equal(updated_value, "two");
    assert(reset_button.visible());

    widget.update(null);
    assert.equal($widget.text(), "translated: not set");
    assert.equal(widget.value(), "");
    assert.equal(updated_value, null);
    assert(!reset_button.visible());

    widget.update("four");
    assert.equal($widget.text(), "translated: not set");
    assert.equal(widget.value(), "four");
    assert.equal(updated_value, "four");
    assert(!reset_button.visible());
});

run_test("no_default_value", () => {
    const opts = {
        widget_name: "my_setting",
        data: ["one", "two", "three"].map((x) => ({name: x, value: x})),
        default_text: i18n.t("not set"),
        render_text: (text) => `rendered: ${text}`,
        null_value: "null-value",
    };

    blueslip.expect(
        "warn",
        "dropdown-list-widget: Called without a default value; using null value",
    );
    setup_zjquery_data(opts.widget_name);
    const widget = dropdown_list_widget(opts);
    assert.equal(widget.value(), "null-value");
});
