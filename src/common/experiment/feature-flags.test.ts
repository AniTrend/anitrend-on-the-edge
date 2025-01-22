import { describe, it, expect, beforeEach } from 'std/testing';
import { assertSpyCalls, spy } from 'std/testing/mock';
import { isNewsApiv2Enabled, getPlatformSource, isAnalyticsEnabled } from './feature-flags.ts';
import { Features } from '../types/core.ts';
import { logger } from '../core/logger.ts';

describe('Experiment Features', () => {
  let mockGrowth: Features;
  let loggerMarkSpy: any;
  let loggerMeasureSpy: any;

  beforeEach(() => {
    // Create mock Growth object
    mockGrowth = {
      isOn: spy(),
      getFeatureValue: spy(),
    };

    // Setup logger spies
    loggerMarkSpy = spy(logger, 'mark');
    loggerMeasureSpy = spy(logger, 'measure');
  });

  describe('isNewsApiv2Enabled', () => {
    it('should return true when news-refactor-api is enabled', () => {
      mockGrowth.isOn.mockImplementation(() => true);
      
      const result = isNewsApiv2Enabled(mockGrowth);
      
      expect(result).toBe(true);
      assertSpyCalls(mockGrowth.isOn, 1);
      expect(mockGrowth.isOn.calls[0].args).toEqual(['news-refactor-api']);
      assertSpyCalls(loggerMarkSpy, 2);
      assertSpyCalls(loggerMeasureSpy, 1);
    });

    it('should return false when news-refactor-api is disabled', () => {
      mockGrowth.isOn.mockImplementation(() => false);
      
      const result = isNewsApiv2Enabled(mockGrowth);
      
      expect(result).toBe(false);
      assertSpyCalls(mockGrowth.isOn, 1);
      expect(mockGrowth.isOn.calls[0].args).toEqual(['news-refactor-api']);
    });
  });

  describe('getPlatformSource', () => {
    it('should return platform source when feature value exists', () => {
      const expectedSource = 'some-platform';
      mockGrowth.getFeatureValue.mockImplementation(() => expectedSource);
      
      const result = getPlatformSource(mockGrowth);
      
      expect(result).toBe(expectedSource);
      assertSpyCalls(mockGrowth.getFeatureValue, 1);
      expect(mockGrowth.getFeatureValue.calls[0].args).toEqual(['platform-source', undefined]);
      assertSpyCalls(loggerMarkSpy, 2);
      assertSpyCalls(loggerMeasureSpy, 1);
    });

    it('should return undefined when feature value does not exist', () => {
      mockGrowth.getFeatureValue.mockImplementation(() => undefined);
      
      const result = getPlatformSource(mockGrowth);
      
      expect(result).toBeUndefined();
      assertSpyCalls(mockGrowth.getFeatureValue, 1);
      expect(mockGrowth.getFeatureValue.calls[0].args).toEqual(['platform-source', undefined]);
    });
  });

  describe('isAnalyticsEnabled', () => {
    it('should return true when enable-analytics is enabled', () => {
      mockGrowth.isOn.mockImplementation(() => true);
      
      const result = isAnalyticsEnabled(mockGrowth);
      
      expect(result).toBe(true);
      assertSpyCalls(mockGrowth.isOn, 1);
      expect(mockGrowth.isOn.calls[0].args).toEqual(['enable-analytics']);
      assertSpyCalls(loggerMarkSpy, 2);
      assertSpyCalls(loggerMeasureSpy, 1);
    });

    it('should return false when enable-analytics is disabled', () => {
      mockGrowth.isOn.mockImplementation(() => false);
      
      const result = isAnalyticsEnabled(mockGrowth);
      
      expect(result).toBe(false);
      assertSpyCalls(mockGrowth.isOn, 1);
      expect(mockGrowth.isOn.calls[0].args).toEqual(['enable-analytics']);
    });
  });
});