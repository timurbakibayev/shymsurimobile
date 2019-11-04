import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    ScrollView
} from 'react-native';
import {FormLabel, FormInput, Button} from 'react-native-elements';
import {connect} from 'react-redux';
import {
    addTrainer,
    trainerNameChanged,
    trainerPhoneChanged,
    trainerRatingChanged,
    trainerLanguageEnglish,
    trainerLanguageKazakh,
    trainerLanguageRussian,
    trainerSki,
    trainerSnowboard
} from "../actions/trainers";
import {
    Card,
    CardSection,
    Input,
    Spinner
} from "../components/common";
import {CheckBox} from 'react-native-elements'


class AddInstructor extends React.Component {

    addTrainerToList() {
        // const {token} = this.props.user;
        const {
            user,
            trainerName,
            trainerPhone,
            trainerRating,
            trainerKazakh,
            trainerEnglish,
            trainerRussian,
            trainerSkillSki,
            trainerSkillSnowboard
        } = this.props;
        this.props.addTrainer({
            user,
            trainerName,
            trainerPhone,
            trainerRating,
            trainerKazakh,
            trainerEnglish,
            trainerRussian,
            trainerSkillSki,
            trainerSkillSnowboard
        });
    }


    onNameChange(text) {
        this.props.trainerNameChanged(text);
    }

    onPhoneChange(text) {
        this.props.trainerPhoneChanged(text);
    }


    onRatingChange(text) {
        this.props.trainerRatingChanged(text);
    }

    renderButton() {
        if (this.props.isLoading) {
            return <Spinner size="large"/>
        }

        return (
            <Button
                backgroundColor='#1668B5'
                raised
                title='Добавить'
                onPress={this.addTrainerToList.bind(this)}/>
        )
    }

    onKazakhChecked() {
        this.props.trainerLanguageKazakh(this.props.trainerKazakh);
    }

    onEnglishChecked() {
        this.props.trainerLanguageEnglish(this.props.trainerEnglish);
    }

    onRussianChecked() {
        this.props.trainerLanguageRussian(this.props.trainerRussian);
    }

    onSkiChecked() {
        this.props.trainerSki(this.props.trainerSkillSki);
    }

    onSnowboardChecked() {
        this.props.trainerSnowboard(this.props.trainerSkillSnowboard);
    }


    render() {
        const {container, outerContainer, errorTextStyle} = styles;

        return (
            <View style={outerContainer}>
                <ScrollView>
                    <Card style={container}>
                        <FormLabel>Имя</FormLabel>
                        <FormInput
                            autoCorrect={false}
                            autoCapitalize='none'
                            placeholder="Имя"
                            onChangeText={this.onNameChange.bind(this)}
                            value={this.props.trainerName}
                        />

                        <FormLabel>Телефон</FormLabel>
                        <FormInput
                            autoCorrect={false}
                            autoCapitalize='none'
                            placeholder="+7 000 123 45 67"
                            onChangeText={this.onPhoneChange.bind(this)}
                            value={this.props.trainerPhone}
                        />
                        <FormLabel>Рейтинг</FormLabel>
                        <FormInput
                            autoCorrect={false}
                            autoCapitalize='none'
                            placeholder="Рейтинг"
                            onChangeText={this.onRatingChange.bind(this)}
                            value={this.props.trainerRating}
                        />

                        <Text style={{fontSize: 20, alignSelf: 'center'}}>Языки</Text>

                        <CheckBox
                            left
                            title='Казахский'
                            onPress={this.onKazakhChecked.bind(this)}
                            checkedIcon='dot-circle-o'
                            uncheckedIcon='circle-o'
                            checked={this.props.trainerKazakh}
                        />
                        <CheckBox
                            left
                            title='Русский'
                            onPress={this.onRussianChecked.bind(this)}
                            checkedIcon='dot-circle-o'
                            uncheckedIcon='circle-o'
                            checked={this.props.trainerRussian}
                        />
                        <CheckBox
                            left
                            onPress={this.onEnglishChecked.bind(this)}
                            title='Английский'
                            checkedIcon='dot-circle-o'
                            uncheckedIcon='circle-o'
                            checked={this.props.trainerEnglish}
                        />


                        <Text style={{fontSize: 20, alignSelf: 'center'}}>Обучение</Text>

                        <CheckBox
                            left
                            title='Лыжи'
                            onPress={this.onSkiChecked.bind(this)}
                            checkedIcon='dot-circle-o'
                            uncheckedIcon='circle-o'
                            checked={this.props.trainerSkillSki}
                        />

                        <CheckBox
                            left
                            onPress={this.onSnowboardChecked.bind(this)}
                            title='Сноуборд'
                            checkedIcon='dot-circle-o'
                            uncheckedIcon='circle-o'
                            checked={this.props.trainerSkillSnowboard}
                        />


                        <Text style={errorTextStyle}>
                            {this.props.error}
                        </Text>
                        {this.renderButton()}
                    </Card>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#369',
        justifyContent: 'center',
        paddingBottom: 15
    },
    outerContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#FFF'
    },
    errorTextStyle: {
        fontSize: 20,
        alignSelf: 'center',
        color: 'red'
    }
});

const mapStateToProps = ({trainer, auth}) => {
    const {user} = auth;
    const {
        trainerName,
        trainerPhone,
        trainerRating,
        trainerKazakh,
        trainerEnglish,
        trainerRussian,
        trainerSkillSki,
        trainerSkillSnowboard
    } = trainer;
    return {
        user,
        trainerName,
        trainerPhone,
        trainerRating,
        trainerKazakh,
        trainerEnglish,
        trainerRussian,
        trainerSkillSki,
        trainerSkillSnowboard
    }
};


export default connect(mapStateToProps, {
    addTrainer, trainerNameChanged, trainerPhoneChanged, trainerRatingChanged,
    trainerLanguageKazakh, trainerLanguageEnglish, trainerLanguageRussian,
    trainerSki, trainerSnowboard
})(AddInstructor);