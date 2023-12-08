from PIL import ImageDraw, Image
from io import BytesIO
import os

from qaseio.pytest import qase
from tests.frontend.pages.base_page import BasePage


class ImageComparer:
    # ACCURACY = 0.0001
    ACCURACY = 0.002

    def compare_pictures(self, screen_staging, screen_production, i):
        screenshot_staging = Image.open(BytesIO(screen_staging))
        screenshot_production = Image.open(BytesIO(screen_production))

        qase.attach((screenshot_staging, "image/png", f"{i}_stage.png"))
        qase.attach((screenshot_production, "image/png", f"{i}_alpha.png"))

        result_image = Image.open(BytesIO(screen_staging))

        # columns = 60
        # rows = 80
        columns = 40
        rows = 40
        screen_width, screen_height = screenshot_staging.size

        block_width = ((screen_width - 1) // columns) + 1
        block_height = ((screen_height - 1) // rows) + 1
        mistaken_blocks = 0

        for y in range(0, screen_height, block_height + 1):
            for x in range(0, screen_width, block_width + 1):
                region_staging = self.process_region(screenshot_staging, x, y, block_width, block_height)
                region_production = self.process_region(screenshot_production, x, y, block_width, block_height)

                if region_staging is None or region_production is None:
                    continue
                diff = region_production / region_staging
                if abs(1 - diff) > self.ACCURACY:
                    draw = ImageDraw.Draw(result_image)
                    draw.rectangle((x, y, x + block_width, y + block_height), outline="red")
                    mistaken_blocks += 1

        qase.attach((result_image, "image/png", f"{i}_compare.png"))

        return mistaken_blocks, result_image

    def process_region(self, image, x, y, width, height):
        region_total = 0

        for coordinateY in range(y, y + height):
            for coordinateX in range(x, x + width):
                try:
                    pixel = image.getpixel((coordinateX, coordinateY))
                    region_total += sum(pixel)
                except:
                    return

        return region_total


def create_screen_folder_if_not_exists(env, browser_name, window_size):
    str_size = f"{window_size[0]},{window_size[1]}"
    directory = f"./screen/{env}_screen/{browser_name}/{str_size}"
    if not os.path.exists(directory):
        print("directory successfully created")
        os.makedirs(directory)
    else:
        print("directory is already exists")


def save_screenshot(browser, env, browser_name, window_size, screen_counter, full_screen=True, element=None):
    str_size = f"{window_size[0]},{window_size[1]}"
    if full_screen:
        browser.save_screenshot(f"./screen/{env}_screen/{browser_name}/{str_size}/{screen_counter()}_{env}.png")
    else:
        bp = BasePage(browser, browser.current_url)
        png = browser.get_screenshot_as_png()
        im = Image.open(BytesIO(png))
        coordinates = bp.get_coordinates_of_element(element)
        im = im.crop(*coordinates)
        im.save(f"./screen/{env}_screen/{browser_name}/{str_size}/{screen_counter()}_{env}.png")


def compare_pictures(env, str_size, browser_name):
    print(f"env = {env}")
    window_size = f"{str_size[0]},{str_size[1]}"
    create_screen_folder_if_not_exists("compare", browser_name, window_size)
    stage_dir = f"./screen/{env}_screen/{browser_name}/{window_size}"
    alpha_dir = f"./screen/alpha_screen/{browser_name}/{window_size}"
    compare_dir = f"./screen/compare_screen/{browser_name}/{window_size}"

    stage_screen_list = os.listdir(stage_dir)
    alpha_screen_list = os.listdir(alpha_dir)

    errors = 0

    for i in range(len(stage_screen_list)):
        stage_file = open(stage_dir + "/" + stage_screen_list[i], "rb")
        stage_screen = stage_file.read()
        stage_file.close()

        alpha_file = open(alpha_dir + "/" + alpha_screen_list[i], "rb")
        alpha_screen = alpha_file.read()
        alpha_file.close()

        get_compare = ImageComparer()
        error, result_image = get_compare.compare_pictures(
            screen_staging=stage_screen, screen_production=alpha_screen, i=i + 1
        )
        print(f"{stage_screen_list[i]} vs {alpha_screen_list[i]}: error = {error}")
        if error != 0:
            errors += 1
            result_image.show()
            result_image.save(f"{compare_dir}/{i+1}_comparing_screen.png")
            qase.attach(result_image)

    assert errors == 0, f"Some visual mistakes! Found {errors} mistaken screens"
