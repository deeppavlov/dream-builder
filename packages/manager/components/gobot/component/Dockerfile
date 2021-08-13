FROM tensorflow/tensorflow:2.5.0-gpu

EXPOSE 5000

WORKDIR /

RUN apt-get update && apt-get install -y wget git && \
    git clone -b rulebased_gobot_trippy https://github.com/Muennighoff/DeepPavlov && \
    cd DeepPavlov && \
    pip install -r requirements.txt

WORKDIR /DeepPavlov

COPY config.json ./config.json
RUN python -m deeppavlov install ./config.json

CMD python -m deeppavlov train ./config.json && \
    python -m deeppavlov riseapi ./config.json
