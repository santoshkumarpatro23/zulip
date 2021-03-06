// For documentation on i18n in Zulip, see:
// https://zulip.readthedocs.io/en/latest/translating/internationalization.html

import i18next from "i18next";

import {page_params} from "./page_params";

i18next.init({
    lng: "lang",
    resources: {
        lang: {
            translation: page_params.translation_data,
        },
    },
    nsSeparator: false,
    keySeparator: false,
    interpolation: {
        prefix: "__",
        suffix: "__",
    },
    returnEmptyString: false, // Empty string is not a valid translation.
});

export const i18n = i18next;
