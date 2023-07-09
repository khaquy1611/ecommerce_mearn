import PropTypes from "prop-types"
const SelectOption = ({ icon }) => {
  return (
    <div className="w-10 h-10 bg-white rounded-full border shadow-md flex justify-center items-center hover:bg-gray-800 hover:text-white cursor-pointer hover:border-gray-800">
        {icon}
    </div>
  )
}

SelectOption.propTypes = {
    icon: PropTypes.element.isRequired
}

export default SelectOption
