import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image, ActivityIndicator, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Project } from '../types';
import { router } from 'expo-router';

// Color constants (same as home.tsx)
const COLORS = {
  primary: '#007BFF',
  success: '#28A745',
  alert: '#DC3545',
  gray: {
    light: '#f8f9fa',
    medium: '#6c757d',
    dark: '#343a40'
  },
  white: '#FFFFFF'
} as const;

// Dummy data (reusing the structure from home.tsx)
const dummyProjects: Project[] = [
  {
    id: '1',
    title: 'Community Garden Initiative',
    description: 'Creating sustainable gardens in urban areas to promote food security and community engagement.',
    location: 'Brooklyn, NY',
    category: 'Environment',
    progress: 75,
    fundingRaised: 15000,
    fundingGoal: 20000,
    volunteers: 28,
    profilePicture: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&auto=format&fit=crop&q=60',
    image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&auto=format&fit=crop&q=60',
    members: 45
  },
  {
    id: '2',
    title: 'Youth Tech Education Program',
    description: 'Providing coding and digital skills training to underprivileged youth in local communities.',
    location: 'San Francisco, CA',
    category: 'Education',
    progress: 45,
    fundingRaised: 25000,
    fundingGoal: 50000,
    volunteers: 15,
    profilePicture: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60',
    members: 32
  },
  {
    id: '3',
    title: 'Elderly Care Support Network',
    description: 'Connecting volunteers with elderly residents for companionship and daily assistance.',
    location: 'Chicago, IL',
    category: 'Healthcare',
    progress: 90,
    fundingRaised: 35000,
    fundingGoal: 40000,
    volunteers: 42,
    profilePicture: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=60',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=60',
    members: 38
  },
];

// Filter options
const categories = ['All', 'Environment', 'Education', 'Healthcare', 'Technology', 'Social'];
const locations = ['All', 'New York', 'San Francisco', 'Chicago', 'Los Angeles', 'Miami'];
const fundingStatuses = ['All', 'Under 25%', '25-50%', '50-75%', 'Over 75%', 'Fully Funded'];
const volunteerNeeds = ['All', '1-10', '11-25', '26-50', '50+', 'Urgent Need'];

interface FilterOption {
  label: string;
  options: string[];
  icon: keyof typeof MaterialIcons.glyphMap;
}

const filterOptions: FilterOption[] = [
  { label: 'Category', options: categories, icon: 'category' },
  { label: 'Location', options: locations, icon: 'location-on' },
  { label: 'Funding', options: fundingStatuses, icon: 'attach-money' },
  { label: 'Volunteers', options: volunteerNeeds, icon: 'people' },
];

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  options: string[];
  selectedOption: string;
  onSelect: (option: string) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  title,
  options,
  selectedOption,
  onSelect,
}) => (
  <Modal
    visible={visible}
    transparent
    animationType="slide"
    onRequestClose={onClose}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{title}</Text>
          <TouchableOpacity onPress={onClose}>
            <MaterialIcons name="close" size={24} color={COLORS.gray.dark} />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.modalOptions}>
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.modalOption,
                option === selectedOption && styles.modalOptionSelected,
              ]}
              onPress={() => {
                onSelect(option);
                onClose();
              }}
            >
              <Text style={[
                styles.modalOptionText,
                option === selectedOption && styles.modalOptionTextSelected,
              ]}>
                {option}
              </Text>
              {option === selectedOption && (
                <MaterialIcons name="check" size={20} color={COLORS.primary} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  </Modal>
);

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => router.push(`/project-details?id=${project.id}`)}
    >
      {/* Project Image */}
      <View style={styles.imageContainer}>
        {imageLoading && (
          <View style={styles.imageLoadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        )}
        {imageError ? (
          <View style={styles.imageErrorContainer}>
            <MaterialIcons name="image-not-supported" size={40} color={COLORS.gray.medium} />
            <Text style={styles.imageErrorText}>Image not available</Text>
          </View>
        ) : (
          <Image
            source={{ uri: project.profilePicture }}
            style={styles.projectImage}
            onLoadStart={() => setImageLoading(true)}
            onLoadEnd={() => setImageLoading(false)}
            onError={() => {
              setImageLoading(false);
              setImageError(true);
            }}
            resizeMode="cover"
          />
        )}
      </View>

      <View style={styles.cardContent}>
        <View style={styles.categoryTag}>
          <Text style={styles.categoryText}>{project.category.toUpperCase()}</Text>
        </View>
        <Text style={styles.projectTitle}>{project.title}</Text>
        <Text style={styles.description} numberOfLines={2}>{project.description}</Text>
        <View style={styles.locationCategory}>
          <Text style={styles.secondaryText}>
            <MaterialIcons name="location-on" size={14} color={COLORS.gray.medium} /> {project.location}
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, {
            width: `${project.progress}%`,
            backgroundColor: project.progress >= 100 ? COLORS.success : COLORS.primary
          }]} />
        </View>
        <View style={styles.progressRow}>
          <Text style={styles.progressText}>{project.progress}% Complete</Text>
          <Text style={[styles.progressText, project.progress >= 100 && styles.successText]}>
            {project.progress >= 100 ? 'COMPLETED' : 'IN PROGRESS'}
          </Text>
        </View>

        {/* Funding Status */}
        <View style={styles.fundingContainer}>
          <Text style={styles.fundingText}>
            <Text style={styles.fundingHighlight}>${project.fundingRaised.toLocaleString()}</Text>
            <Text style={styles.fundingSecondary}> / ${project.fundingGoal.toLocaleString()}</Text>
          </Text>
        </View>

        {/* Volunteers */}
        <View style={styles.footer}>
          <View style={styles.volunteersContainer}>
            <MaterialIcons name="people" size={16} color={COLORS.primary} />
            <Text style={styles.volunteersText}>{project.volunteers} Volunteers</Text>
          </View>
          <Text style={styles.viewDetailsText}>VIEW DETAILS →</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    category: 'All',
    location: 'All',
    funding: 'All',
    volunteers: 'All',
  });
  const [activeFilter, setActiveFilter] = useState<FilterOption | null>(null);

  const handleFilterSelect = (filterType: keyof typeof selectedFilters, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const filteredProjects = dummyProjects.filter(project => {
    if (selectedFilters.category !== 'All' && project.category !== selectedFilters.category) return false;
    if (selectedFilters.location !== 'All' && !project.location.includes(selectedFilters.location)) return false;

    // Funding filter
    if (selectedFilters.funding !== 'All') {
      const fundingPercentage = (project.fundingRaised / project.fundingGoal) * 100;
      switch (selectedFilters.funding) {
        case 'Under 25%':
          if (fundingPercentage >= 25) return false;
          break;
        case '25-50%':
          if (fundingPercentage < 25 || fundingPercentage >= 50) return false;
          break;
        case '50-75%':
          if (fundingPercentage < 50 || fundingPercentage >= 75) return false;
          break;
        case 'Over 75%':
          if (fundingPercentage < 75) return false;
          break;
        case 'Fully Funded':
          if (fundingPercentage < 100) return false;
          break;
      }
    }

    // Volunteers filter
    if (selectedFilters.volunteers !== 'All') {
      switch (selectedFilters.volunteers) {
        case '1-10':
          if (project.volunteers > 10) return false;
          break;
        case '11-25':
          if (project.volunteers < 11 || project.volunteers > 25) return false;
          break;
        case '26-50':
          if (project.volunteers < 26 || project.volunteers > 50) return false;
          break;
        case '50+':
          if (project.volunteers <= 50) return false;
          break;
        case 'Urgent Need':
          if (project.volunteers > 10) return false;
          break;
      }
    }

    return true;
  });

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={24} color={COLORS.gray.medium} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search projects by keyword or location"
            placeholderTextColor={COLORS.gray.medium}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <MaterialIcons
            name="tune"
            size={24}
            color={showFilters ? COLORS.primary : COLORS.gray.dark}
          />
        </TouchableOpacity>
      </View>

      {/* Filter Options */}
      {showFilters && (
        <View style={styles.filterContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScrollContent}
          >
            {filterOptions.map((filter) => (
              <TouchableOpacity
                key={filter.label}
                style={[
                  styles.filterOption,
                  selectedFilters[filter.label.toLowerCase() as keyof typeof selectedFilters] !== 'All' &&
                  styles.filterOptionActive
                ]}
                onPress={() => setActiveFilter(filter)}
              >
                <MaterialIcons name={filter.icon} size={14} color={COLORS.primary} />
                <Text style={styles.filterText}>{filter.label}</Text>
                <MaterialIcons name="arrow-drop-down" size={16} color={COLORS.primary} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Project List */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {filteredProjects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </ScrollView>

      {/* Filter Modal */}
      {activeFilter && (
        <FilterModal
          visible={!!activeFilter}
          onClose={() => setActiveFilter(null)}
          title={activeFilter.label}
          options={activeFilter.options}
          selectedOption={selectedFilters[activeFilter.label.toLowerCase() as keyof typeof selectedFilters]}
          onSelect={(option) => handleFilterSelect(activeFilter.label.toLowerCase() as keyof typeof selectedFilters, option)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray.light,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray.light,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: COLORS.gray.dark,
  },
  filterButton: {
    padding: 8,
  },
  filterContainer: {
    backgroundColor: COLORS.white,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
  },
  filterScrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.gray.medium,
    marginRight: 6,
    height: 30,
  },
  filterOptionActive: {
    backgroundColor: COLORS.primary + '15',
    borderColor: COLORS.primary,
  },
  filterText: {
    color: COLORS.gray.dark,
    marginHorizontal: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
    paddingTop: 8,
  },
  card: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: COLORS.gray.light,
  },
  projectImage: {
    width: '100%',
    height: '100%',
  },
  imageLoadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.gray.light,
  },
  imageErrorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.gray.light,
  },
  imageErrorText: {
    marginTop: 8,
    color: COLORS.gray.medium,
    fontSize: 14,
  },
  cardContent: {
    padding: 16,
  },
  categoryTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: COLORS.primary + '15',
    borderRadius: 4,
    marginBottom: 12,
  },
  categoryText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  projectTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: COLORS.gray.dark,
  },
  description: {
    fontSize: 14,
    color: COLORS.gray.medium,
    marginBottom: 12,
    lineHeight: 20,
  },
  locationCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  secondaryText: {
    fontSize: 14,
    color: COLORS.gray.medium,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#E9ECEF',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressText: {
    fontSize: 12,
    color: COLORS.gray.medium,
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  successText: {
    color: COLORS.success,
  },
  fundingContainer: {
    marginBottom: 16,
  },
  fundingText: {
    fontSize: 16,
  },
  fundingHighlight: {
    color: COLORS.gray.dark,
    fontWeight: 'bold',
  },
  fundingSecondary: {
    color: COLORS.gray.medium,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  volunteersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  volunteersText: {
    fontSize: 14,
    color: COLORS.gray.medium,
    marginLeft: 6,
  },
  viewDetailsText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.gray.dark,
  },
  modalOptions: {
    maxHeight: 400,
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalOptionSelected: {
    backgroundColor: COLORS.primary + '10',
  },
  modalOptionText: {
    fontSize: 16,
    color: COLORS.gray.dark,
  },
  modalOptionTextSelected: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});
