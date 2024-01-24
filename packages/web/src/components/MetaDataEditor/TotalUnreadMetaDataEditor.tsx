import { Form, InputNumber, Radio } from 'antd';
import { isNumber } from 'lodash-es';
import { useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { dialogueListState } from '@/state/dialogueState';
import totalUnreadCountState, { CalcuateType, ITotalUnreadCountState } from '@/state/totalUnreadCountState';

const TotalUnreadMetaDataEditor = ({ data }: EditorProps<ITotalUnreadCountState>) => {
  const [form] = Form.useForm<ITotalUnreadCountState>();
  const dialogueList = useRecoilValue(dialogueListState);
  const setTotalUnreadCount = useSetRecoilState(totalUnreadCountState);

  const calcuateTypeValue = Form.useWatch('calcuateType', form);

  useEffect(() => {
    if (calcuateTypeValue === CalcuateType.AUTO) {
      const count = dialogueList.reduce((acc, dialogue) => {
        if (!dialogue.badgeHide && dialogue.unreadDisplayType !== 'dot' && isNumber(dialogue.unreadMarkNumber)) {
          return acc + dialogue.unreadMarkNumber;
        }
        return acc;
      }, 0);
      form.setFieldValue('count', count);
    }
  }, [calcuateTypeValue]);

  const onFinish = (v: ITotalUnreadCountState) => {
    setTotalUnreadCount(v);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      autoComplete="off"
      onFinish={onFinish}
      onValuesChange={() => {
        setTimeout(() => {
          form.submit();
        });
      }}
      initialValues={data}
    >
      <Form.Item<ITotalUnreadCountState> name="calcuateType" label="通知数量计算方式">
        <Radio.Group>
          <Radio value={CalcuateType.AUTO}>自动</Radio>
          <Radio value={CalcuateType.STATIC}>静态值</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item<ITotalUnreadCountState> name="count" label="通知数量">
        <InputNumber disabled={calcuateTypeValue === CalcuateType.AUTO} min={0} />
      </Form.Item>
    </Form>
  );
};

export default TotalUnreadMetaDataEditor;
