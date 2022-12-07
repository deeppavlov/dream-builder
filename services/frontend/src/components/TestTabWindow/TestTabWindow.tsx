import { Tabs, Tab, TabPanel, TabList } from 'react-tabs'
import { Wrapper } from '../../ui/Wrapper/Wrapper'
import s from './TestTabWindow.module.scss'

export const TestTabWindow = () => {
  return (
    <Wrapper height='100%'>
      <div className={s.container}>
        <Tabs>
          <TabList>
            <div className={s.header}>
              <Tab>
                <button>Results</button>
              </Tab>
              <Tab>
                <button>Output</button>
              </Tab>
              <Tab>
                <button>Warnings & Errors</button>
              </Tab>
            </div>
          </TabList>

          <TabPanel>
            <div className={s.body}>
              <p>
                {
                  '{"train": {"eval_examples_count": 585000, "metrics": {"roc_auc": 0.9475, "sets_accuracy": 0.7397, "f1_macro": 0.7376}, "time_spent": "1:55:50"}} {"valid": {"eval_examples_count": 65000, "metrics": {"roc_auc": 0.9268, "sets_accuracy": 0.686, "f1_macro": 0.6838}, "time_spent": "0:12:51"}} {"test": {"eval_examples_count": 50000, "metrics": {"roc_auc": 0.9251, "sets_accuracy": 0.6785, "f1_macro": 0.6758}, "time_spent": "0:09:36"}}'
                }
              </p>
            </div>
          </TabPanel>
          <TabPanel>
            <div className={s.body}>
              <p>{`{"valid": {"eval_examples_count": 65000, "metrics": {"roc_auc": 0.4966, "sets_accuracy": 0.2131, "f1_macro": 0.1084}, "time_spent": "0:12:13", "epochs_done": 0, "batches_seen": 0, "train_examples_seen": 0, "impatience": 0, "patience_limit": 5}}
{"train": {"eval_examples_count": 32, "metrics": {"roc_auc": 0.8968, "sets_accuracy": 0.6562, "f1_macro": 0.6254}, "time_spent": "4:50:43", "epochs_done": 1, "batches_seen": 18282, "train_examples_seen": 585000, "learning_rate": 1e-05, "loss": 0.8033212590561225}}
{"valid": {"eval_examples_count": 65000, "metrics": {"roc_auc": 0.9242, "sets_accuracy": 0.6776, "f1_macro": 0.6753}, "time_spent": "5:03:00", "epochs_done": 1, "batches_seen": 18282, "train_examples_seen": 585000, "impatience": 0, "patience_limit": 5}}
{"train": {"eval_examples_count": 32, "metrics": {"roc_auc": 0.9147, "sets_accuracy": 0.6875, "f1_macro": 0.661}, "time_spent": "9:41:18", "epochs_done": 2, "batches_seen": 36564, "train_examples_seen": 1170000, "learning_rate": 1e-05, "loss": 0.7024718803361657}}
{"valid": {"eval_examples_count": 65000, "metrics": {"roc_auc": 0.9268, "sets_accuracy": 0.686, "f1_macro": 0.6838}, "time_spent": "9:53:46", "epochs_done": 2, "batches_seen": 36564, "train_examples_seen": 1170000, "impatience": 0, "patience_limit": 5}}
{"train": {"eval_examples_count": 32, "metrics": {"roc_auc": 0.9982, "sets_accuracy": 0.9688, "f1_macro": 0.9597}, "time_spent": "14:34:56", "epochs_done": 3, "batches_seen": 54846, "train_examples_seen": 1755000, "learning_rate": 1e-05, "loss": 0.6413727998293381}}
{"valid": {"eval_examples_count": 65000, "metrics": {"roc_auc": 0.9268, "sets_accuracy": 0.6857, "f1_macro": 0.6857}, "time_spent": "14:47:07", "epochs_done": 3, "batches_seen": 54846, "train_examples_seen": 1755000, "impatience": 1, "patience_limit": 5}}
{"train": {"eval_examples_count": 32, "metrics": {"roc_auc": 0.9133, "sets_accuracy": 0.75, "f1_macro": 0.7361}, "time_spent": "19:24:48", "epochs_done": 4, "batches_seen": 73128, "train_examples_seen": 2340000, "learning_rate": 1e-05, "loss": 0.5787751838767011}}
{"valid": {"eval_examples_count": 65000, "metrics": {"roc_auc": 0.9245, "sets_accuracy": 0.6823, "f1_macro": 0.6797}, "time_spent": "19:37:10", "epochs_done": 4, "batches_seen": 73128, "train_examples_seen": 2340000, "impatience": 2, "patience_limit": 5}}
{"train": {"eval_examples_count": 32, "metrics": {"roc_auc": 0.978, "sets_accuracy": 0.7812, "f1_macro": 0.8028}, "time_spent": "1 day, 0:17:04", "epochs_done": 5, "batches_seen": 91410, "train_examples_seen": 2925000, "learning_rate": 1e-05, "loss": 0.5154032367923995}}
{"valid": {"eval_examples_count": 65000, "metrics": {"roc_auc": 0.9209, "sets_accuracy": 0.6763, "f1_macro": 0.6737}, "time_spent": "1 day, 0:29:32", "epochs_done": 5, "batches_seen": 91410, "train_examples_seen": 2925000, "impatience": 3, "patience_limit": 5}}
{"train": {"eval_examples_count": 32, "metrics": {"roc_auc": 0.9897, "sets_accuracy": 0.875, "f1_macro": 0.8491}, "time_spent": "1 day, 5:07:55", "epochs_done": 6, "batches_seen": 109692, "train_examples_seen": 3510000, "learning_rate": 1e-05, "loss": 0.45122395075524274}}
{"valid": {"eval_examples_count": 65000, "metrics": {"roc_auc": 0.9174, "sets_accuracy": 0.6673, "f1_macro": 0.6686}, "time_spent": "1 day, 5:20:11", "epochs_done": 6, "batches_seen": 109692, "train_examples_seen": 3510000, "impatience": 4, "patience_limit": 5}}
{"train": {"eval_examples_count": 32, "metrics": {"roc_auc": 0.9901, "sets_accuracy": 0.8125, "f1_macro": 0.806}, "time_spent": "1 day, 9:59:17", "epochs_done": 7, "batches_seen": 127974, "train_examples_seen": 4095000, "learning_rate": 1e-05, "loss": 0.39127011494212827}}
{"valid": {"eval_examples_count": 65000, "metrics": {"roc_auc": 0.9164, "sets_accuracy": 0.6692, "f1_macro": 0.6684}, "time_spent": "1 day, 10:11:43", "epochs_done": 7, "batches_seen": 127974, "train_examples_seen": 4095000, "impatience": 5, "patience_limit": 5}}
{"train": {"eval_examples_count": 585000, "metrics": {"roc_auc": 0.9475, "sets_accuracy": 0.7397, "f1_macro": 0.7376}, "time_spent": "1:55:50"}}
{"valid": {"eval_examples_count": 65000, "metrics": {"roc_auc": 0.9268, "sets_accuracy": 0.686, "f1_macro": 0.6838}, "time_spent": "0:12:51"}}
{"test": {"eval_examples_count": 50000, "metrics": {"roc_auc": 0.9251, "sets_accuracy": 0.6785, "f1_macro": 0.6758}, "time_spent": "0:09:36"}}
`}</p>
            </div>
          </TabPanel>
          <TabPanel>
            <div className={s.body}>
              <p>{`nohup: ignoring input
2019-07-24 16:50:35.508 INFO in 'deeppavlov.core.common.file'['file'] at line 30: Interpreting 'sentiment_yelp_bert' as '/cephfs/home/dilyara.baymurzina/GitHub/DeepPavlov/deeppavlov/configs/classifiers/sentiment_yelp_bert.json'
2019-07-24 16:51:36.118 WARNING in 'deeppavlov.dataset_readers.basic_classification_reader'['basic_classification_reader'] at line 95: Cannot find /cephfs/home/dilyara.baymurzina/.deeppavlov/downloads/yelp_review_full_csv/valid.csv file
2019-07-24 16:51:40.375 INFO in 'deeppavlov.dataset_iterators.basic_classification_iterator'['basic_classification_iterator'] at line 73: Splitting field <<train>> to new fields <<['train', 'valid']>>
[nltk_data] Downloading package punkt to
[nltk_data]     /home/dilyara.baymurzina/nltk_data...
[nltk_data]   Package punkt is already up-to-date!
[nltk_data] Downloading package stopwords to
[nltk_data]     /home/dilyara.baymurzina/nltk_data...
[nltk_data]   Package stopwords is already up-to-date!
[nltk_data] Downloading package perluniprops to
[nltk_data]     /home/dilyara.baymurzina/nltk_data...
[nltk_data]   Package perluniprops is already up-to-date!
[nltk_data] Downloading package nonbreaking_prefixes to
[nltk_data]     /home/dilyara.baymurzina/nltk_data...
[nltk_data]   Package nonbreaking_prefixes is already up-to-date!
2019-07-24 16:52:12.134 INFO in 'deeppavlov.core.data.simple_vocab'['simple_vocab'] at line 89: [saving vocabulary to /cephfs/home/dilyara.baymurzina/.deeppavlov/models/classifiers/sentiment_yelp_bert_v0/classes.dict]
2019-07-24 16:52:12.247941: I tensorflow/core/platform/cpu_feature_guard.cc:141] Your CPU supports instructions that this TensorFlow binary was not compiled to use: AVX2 FMA
2019-07-24 16:52:12.936378: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1405] Found device 0 with properties: 
name: Tesla P100-SXM2-16GB major: 6 minor: 0 memoryClockRate(GHz): 1.4805
pciBusID: 0000:0a:00.0
totalMemory: 15.90GiB freeMemory: 15.61GiB
2019-07-24 16:52:12.936572: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1484] Adding visible gpu devices: 0
2019-07-24 16:52:14.344105: I tensorflow/core/common_runtime/gpu/gpu_device.cc:965] Device interconnect StreamExecutor with strength 1 edge matrix:
2019-07-24 16:52:14.344326: I tensorflow/core/common_runtime/gpu/gpu_device.cc:971]      0 
2019-07-24 16:52:14.344348: I tensorflow/core/common_runtime/gpu/gpu_device.cc:984] 0:   N 
2019-07-24 16:52:14.344914: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1097] Created TensorFlow device (/job:localhost/replica:0/task:0/device:GPU:0 with 15129 MB memory) -> physical GPU (device: 0, name: Tesla P100-SXM2-16GB, pci bus id: 0000:0a:00.0, compute capability: 6.0)
Using TensorFlow backend.
2019-07-24 16:52:49.149 INFO in 'deeppavlov.models.bert.bert_classifier'['bert_classifier'] at line 98: [initializing model with Bert from /cephfs/home/dilyara.baymurzina/.deeppavlov/downloads/bert_models/cased_L-12_H-768_A-12/bert_model.ckpt]
/home/dilyara.baymurzina/anaconda3/envs/deeppavlov36/lib/python3.6/site-packages/sklearn/metrics/classification.py:1135: UndefinedMetricWarning: F-score is ill-defined and being set to 0.0 in labels with no predicted samples.
  'precision', 'predicted', average, warn_for)
2019-07-24 17:05:03.984 INFO in 'deeppavlov.core.trainers.nn_trainer'['nn_trainer'] at line 164: New best roc_auc of 0.4966
2019-07-24 17:05:03.984 INFO in 'deeppavlov.core.trainers.nn_trainer'['nn_trainer'] at line 166: Saving model
2019-07-24 17:05:03.986 INFO in 'deeppavlov.core.models.tf_model'['tf_model'] at line 76: [saving model to /cephfs/home/dilyara.baymurzina/.deeppavlov/models/classifiers/sentiment_yelp_bert_v0/model]
2019-07-24 21:55:50.906 INFO in 'deeppavlov.core.trainers.nn_trainer'['nn_trainer'] at line 164: New best roc_auc of 0.9242
2019-07-24 21:55:50.907 INFO in 'deeppavlov.core.trainers.nn_trainer'['nn_trainer'] at line 166: Saving model
2019-07-24 21:55:50.910 INFO in 'deeppavlov.core.models.tf_model'['tf_model'] at line 76: [saving model to /cephfs/home/dilyara.baymurzina/.deeppavlov/models/classifiers/sentiment_yelp_bert_v0/model]
2019-07-25 02:46:37.134 INFO in 'deeppavlov.core.trainers.nn_trainer'['nn_trainer'] at line 164: New best roc_auc of 0.9268
2019-07-25 02:46:37.135 INFO in 'deeppavlov.core.trainers.nn_trainer'['nn_trainer'] at line 166: Saving model
2019-07-25 02:46:37.136 INFO in 'deeppavlov.core.models.tf_model'['tf_model'] at line 76: [saving model to /cephfs/home/dilyara.baymurzina/.deeppavlov/models/classifiers/sentiment_yelp_bert_v0/model]
2019-07-25 07:39:57.747 INFO in 'deeppavlov.core.trainers.nn_trainer'['nn_trainer'] at line 170: Did not improve on the roc_auc of 0.9268
2019-07-25 12:30:01.405 INFO in 'deeppavlov.core.trainers.nn_trainer'['nn_trainer'] at line 170: Did not improve on the roc_auc of 0.9268
2019-07-25 17:22:22.760 INFO in 'deeppavlov.core.trainers.nn_trainer'['nn_trainer'] at line 170: Did not improve on the roc_auc of 0.9268
2019-07-25 22:13:02.158 INFO in 'deeppavlov.core.trainers.nn_trainer'['nn_trainer'] at line 170: Did not improve on the roc_auc of 0.9268
2019-07-26 03:04:34.368 INFO in 'deeppavlov.core.trainers.nn_trainer'['nn_trainer'] at line 170: Did not improve on the roc_auc of 0.9268
2019-07-26 03:04:34.761 INFO in 'deeppavlov.core.models.lr_scheduled_model'['lr_scheduled_model'] at line 430: New learning rate dividor = 2.0
2019-07-26 03:04:35.116 INFO in 'deeppavlov.core.trainers.nn_trainer'['nn_trainer'] at line 286: Ran out of patience
2019-07-26 03:04:35.352 INFO in 'deeppavlov.core.data.simple_vocab'['simple_vocab'] at line 103: [loading vocabulary from /cephfs/home/dilyara.baymurzina/.deeppavlov/models/classifiers/sentiment_yelp_bert_v0/classes.dict]
2019-07-26 03:04:35.371100: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1484] Adding visible gpu devices: 0
2019-07-26 03:04:35.371332: I tensorflow/core/common_runtime/gpu/gpu_device.cc:965] Device interconnect StreamExecutor with strength 1 edge matrix:
2019-07-26 03:04:35.371358: I tensorflow/core/common_runtime/gpu/gpu_device.cc:971]      0 
2019-07-26 03:04:35.371372: I tensorflow/core/common_runtime/gpu/gpu_device.cc:984] 0:   N 
2019-07-26 03:04:35.371781: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1097] Created TensorFlow device (/job:localhost/replica:0/task:0/device:GPU:0 with 15129 MB memory) -> physical GPU (device: 0, name: Tesla P100-SXM2-16GB, pci bus id: 0000:0a:00.0, compute capability: 6.0)
2019-07-26 03:04:55.920 INFO in 'deeppavlov.core.models.tf_model'['tf_model'] at line 52: [loading model from /cephfs/home/dilyara.baymurzina/.deeppavlov/models/classifiers/sentiment_yelp_bert_v0/model]
`}</p>
            </div>
          </TabPanel>

          <div className={s.bottom}>
            <button>Download</button>
          </div>
        </Tabs>
      </div>
    </Wrapper>
  )
}
