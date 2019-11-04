import React from 'react';
import {Card, CardSection, Input} from "../components/common";
import DatePicker from 'react-native-datepicker';
import {CheckBox} from 'react-native-elements';
import {Button} from "../components/common/Button";
import {connect} from 'react-redux';
import {
    trainingSnowboard,
    trainingSki,
    descriptionChanged,
    trainingDateStart,
    trainingDateEnd,
    addEventToServer
} from '../actions/trainings';


class AddEvent extends React.Component {

    onSnowboardChecked() {
        this.props.trainingSnowboard(this.props.trainingAddSnowboard);
    }

    onSkiChecked() {
        this.props.trainingSki(this.props.trainingAddSki);
    }

    onDateStartChange(date) {
        this.props.trainingDateStart(date);
    }

    onDateEndChange(date) {
        this.props.trainingDateEnd(date);
    }

    onDescriptionChange(text) {
        this.props.descriptionChanged(text);
    }

    saveEvent() {
        const {user, trainingAddSki, trainingAddSnowboard, trainingDescription, trainingTimeDateStart, trainingTimeDateEnd} = this.props;

        this.props.addEventToServer({user, trainingAddSki, trainingAddSnowboard, trainingDescription, trainingTimeDateStart, trainingTimeDateEnd});
    }

    render() {
        return (
            <Card>
                <CardSection>
                    <DatePicker
                        style={{width: 200}}
                        date={this.props.trainingTimeDateStart}
                        mode="datetime"
                        placeholder="Дата начала"
                        // format="YYYY-MM-DD"
                        format="YYYY-MM-DD HH:mm:ss"
                        minDate="2016-05-01"
                        // maxDate="2017-12-31"
                        confirmBtnText="Подтвердить"
                        cancelBtnText="Отмена"
                        customStyles={{
                            dateIcon: {
                                position: 'absolute',
                                left: 0,
                                top: 4,
                                marginLeft: 0
                            },
                            dateInput: {
                                marginLeft: 36
                            }
                            // ... You can check the source to find the other keys.
                        }}
                        onDateChange={this.onDateStartChange.bind(this)}
                    />
                </CardSection>
                <CardSection>
                    <DatePicker
                        style={{width: 200}}
                        date={this.props.trainingTimeDateEnd}
                        mode="datetime"
                        placeholder="Дата завершения"
                        // format="YYYY-MM-DD"
                        format="YYYY-MM-DD HH:mm:ss"
                        minDate="2017-09-15"
                        // maxDate="2017-12-31"
                        confirmBtnText="Подтвердить"
                        cancelBtnText="Отмена"
                        customStyles={{
                            dateIcon: {
                                position: 'absolute',
                                left: 0,
                                top: 4,
                                marginLeft: 0
                            },
                            dateInput: {
                                marginLeft: 36
                            }
                            // ... You can check the source to find the other keys.
                        }}
                        onDateChange={this.onDateEndChange.bind(this)}
                    />
                </CardSection>
                <CardSection>
                    <Input label="Описание"
                           placeholder="Описание"
                           onChangeText={this.onDescriptionChange.bind(this)}
                           value={this.props.trainingDescription}
                    />
                </CardSection>

                <CheckBox
                    left
                    title='Лыжи'
                    onPress={this.onSkiChecked.bind(this)}
                    checkedIcon='dot-circle-o'
                    uncheckedIcon='circle-o'
                    checked={this.props.trainingAddSki}
                />

                <CheckBox
                    left
                    onPress={this.onSnowboardChecked.bind(this)}
                    title='Сноуборд'
                    checkedIcon='dot-circle-o'
                    uncheckedIcon='circle-o'
                    checked={this.props.trainingAddSnowboard}
                />
                <CardSection>
                    <Button onPress={this.saveEvent.bind(this)}>Сохранить</Button>
                </CardSection>
            </Card>
        )
    }
}

const mapStateToProps = ({training, auth}) => {
    const {user} = auth;
    const {trainingAddSki, trainingAddSnowboard, trainingDescription, trainingTimeDateStart, trainingTimeDateEnd} = training;
    return {user, trainingAddSki, trainingAddSnowboard, trainingDescription, trainingTimeDateStart, trainingTimeDateEnd};
};


export default connect(mapStateToProps, {
    trainingSnowboard,
    trainingSki,
    descriptionChanged,
    trainingDateStart,
    trainingDateEnd,
    addEventToServer
})(AddEvent);