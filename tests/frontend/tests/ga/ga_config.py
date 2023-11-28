import time
from seleniumwire.utils import decode
import json
from urllib.parse import parse_qs


def get_ga_requests(browser,
                    event_name,
                    page
                    ):
    print()
    print('Параметры входа:')
    print(page.event_name,
          page.source_type,
          page.page_type,
          page.view,
          page.auth_status,
          page.va_prev_status,
          page.services,
          )

    time.sleep(9)
    for request in browser.requests[::-1]:
        if request.url.startswith("https://www.google-analytics.com/g/collect?"):
            query_string = request.url
            json_parameters = json.dumps(parse_qs(query_string))
            dict_parameters = json.loads(json_parameters)

            # print(f'dict_parameters = {dict_parameters}')

            if "en" in dict_parameters and dict_parameters['en'][0] == event_name:
                selected = dict_parameters.copy()
                for key, value in dict_parameters.items():
                    if key != "en":
                        selected.pop(key)
                    else:
                        break

                print(f'selected = {selected}')
                print()

                parameters_data_dict = {"ep.source_type": page.source_type,
                                        "ep.page_type": page.page_type,
                                        "ep.auth_status": page.auth_status,
                                        "ep.view": page.view,
                                        "ep.va_prev_status": page.va_prev_status,
                                        "ep.services": page.services,
                                        }

                for ep_parameter, parameter in parameters_data_dict.items():
                    if ep_parameter in dict_parameters:
                        assert selected[ep_parameter][0] == parameter, \
                            f'{ep_parameter}: {selected[ep_parameter][0]} == {parameter}'

                break
