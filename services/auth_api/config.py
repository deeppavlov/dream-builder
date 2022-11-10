import configparser
import os
from pathlib import Path


config = configparser.ConfigParser()
config.read(Path(__file__).with_name(".env").absolute())
