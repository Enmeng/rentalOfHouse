<template>
    <div class="fill-house-information">
        <div class="information-title">
            <p>
                填写房屋信息
            </p>
        </div>
        <div class="information-panel">
            <Form :label-width="80">
                <FormItem label="房屋地址">
                    <Row>
                        <Col span="7">
                            <Input placeholder="广东">
                                <span slot="append">省</span>
                            </Input>
                        </Col>
                        <Col span="7">
                            <Input  placeholder="广州">
                                <span slot="append">市</span>
                            </Input>
                        </Col>
                        <Col span="7">
                            <Input  placeholder="天河">
                                <span slot="append">区</span>
                            </Input>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label="房屋大小">
                    <Input  type="number"  placeholder="100">
                        <span slot="append">平方米</span>
                    </Input>
                </FormItem>
                <FormItem label="房屋类型">
                    <Row>
                        <Col span="7">
                            <Input placeholder="1" type="number">
                                <span slot="append">室</span>
                            </Input>
                        </Col>
                        <Col span="7">
                            <Input  placeholder="1" type="number">
                                <span slot="append">厅</span>
                            </Input>
                        </Col>
                        <Col span="7">
                            <Input  placeholder="1" type="number">
                                <span slot="append">卫</span>
                            </Input>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label="出租价格">
                    <Input  type="number"  placeholder="2000">
                        <span slot="append">元/月</span>
                    </Input>
                </FormItem>
                <FormItem label="配备家具">
                    <i-switch size="large">
                        <span slot="open">是</span>
                        <span slot="close">否</span>
                    </i-switch>
                </FormItem>
                <FormItem label="出租日期">
                    <Row>
                        <Col span="11">
                            <DatePicker type="date" placeholder="开始日期" ></DatePicker>
                        </Col>
                        <Col span="2" style="text-align: center">-</Col>
                        <Col span="11">
                            <DatePicker type="date" placeholder="结束日期" ></DatePicker>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label="上传照片">
                    <Button type="primary">上传</Button>
                </FormItem>
                <FormItem label="备注">
                    <Input  type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="其他描述信息"></Input>
                </FormItem>
                <FormItem>
                    <Button>重置</Button>
                    <Button style="margin-left: 8px" type="primary">保存</Button>
                </FormItem>
            </Form>
        </div>
    </div>
</template>
<style>
    .fill-house-information{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .information-title{
        font-size:20px;
        font-weight:300px;
        margin-top:40px;
    }
    .information-panel{
        margin-top:20px;
    }
</style>
<script>
    export default{
        name:'fillHouseInformation',
        props:['userName'],
        data(){
            return {

            }
        }
    }
</script>