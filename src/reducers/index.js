import {combineReducers} from 'redux';
import AuthReducer from './AuthReducer';
import ScreenReducer from './ScreenReducer';
import UsersReducer from './UsersReducer';
import TrainerReducer from './TrainerResucer'
import TrainingReducer from './TrainingReducer';
import TakenTrainer from './TakenTrainerReducer';
import ReportReducer from './ReportReducer';
import InstructorDetailsReducer from './InstructorDetailsReducer';
import InstructorReducer from './InstructorReducer';

export default combineReducers({
    auth: AuthReducer,
    screen: ScreenReducer,
    users: UsersReducer,
    trainer: TrainerReducer,
    training: TrainingReducer,
    takenTrainer: TakenTrainer,
    reportsReducer: ReportReducer,
    instructorDetails: InstructorDetailsReducer,
    instructorReducer: InstructorReducer

})